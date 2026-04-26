// Socket.IO client
const socket = io();

// DOM elements
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

// State
let isConnected = false;
let messageHistory = [];
let isTyping = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadTheme();
    scrollToBottom();
});

// Socket.IO event handlers
socket.on('connect', () => {
    isConnected = true;
    console.log('Connected to server');
    updateConnectionStatus(true);
});

socket.on('disconnect', () => {
    isConnected = false;
    console.log('Disconnected from server');
    updateConnectionStatus(false);
});

socket.on('message_history', (history) => {
    messageHistory = history;
    renderMessageHistory();
});

socket.on('new_message', (message) => {
    addMessage(message);
    if (message.type === 'bot') {
        hideTypingIndicator();
    }
});

socket.on('message_update', (message) => {
    updateMessage(message);
    if (message.status === 'sent' || message.status === 'error') {
        hideTypingIndicator();
    }
});

// Event listeners
function setupEventListeners() {
    // Message input
    messageInput.addEventListener('input', handleInputChange);
    messageInput.addEventListener('keypress', handleKeyPress);
    
    // Send button
    sendButton.addEventListener('click', sendMessage);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            messageInput.focus();
        }
    });
    
    // Modal backdrop clicks
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function handleInputChange() {
    const hasText = messageInput.value.trim().length > 0;
    sendButton.disabled = !hasText || !isConnected;
    
    // Auto-resize textarea functionality would go here if we used textarea
}

function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// Message functions
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !isConnected) return;
    
    // Clear input
    messageInput.value = '';
    handleInputChange();
    
    // Send to server
    socket.emit('send_message', { message: text, type: 'user' });
    
    // Show typing indicator for bot response
    showTypingIndicator();
}

function sendQuickMessage(text) {
    messageInput.value = text;
    sendMessage();
}

function addMessage(message) {
    messageHistory.push(message);
    renderMessage(message);
    scrollToBottom();
}

function updateMessage(message) {
    const index = messageHistory.findIndex(m => m.id === message.id);
    if (index !== -1) {
        messageHistory[index] = message;
        const messageElement = document.querySelector(`[data-message-id="${message.id}"]`);
        if (messageElement) {
            renderMessageContent(messageElement, message);
        }
    }
}

function renderMessageHistory() {
    // Clear existing messages but keep welcome message if no history
    const existingMessages = messagesContainer.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    if (messageHistory.length === 0) {
        showWelcomeMessage();
    } else {
        hideWelcomeMessage();
        messageHistory.forEach(message => renderMessage(message));
    }
    scrollToBottom();
}

function renderMessage(message) {
    hideWelcomeMessage();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}`;
    messageDiv.dataset.messageId = message.id;
    
    renderMessageContent(messageDiv, message);
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function renderMessageContent(container, message) {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.innerHTML = formatMessageText(message.text);
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = formatTime(message.timestamp);
    
    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timeDiv);
    
    // Add status indicator for user messages
    if (message.type === 'user' && message.status) {
        const statusDiv = document.createElement('div');
        statusDiv.className = `message-status ${message.status}`;
        statusDiv.textContent = getStatusIcon(message.status);
        contentDiv.appendChild(statusDiv);
    }
    
    container.innerHTML = '';
    container.appendChild(contentDiv);
}

function formatMessageText(text) {
    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert line breaks
    text = text.replace(/\n/g, '<br>');
    
    // Basic markdown-like formatting
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    return text;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getStatusIcon(status) {
    switch (status) {
        case 'sending': return '⏳';
        case 'sent': return '✓';
        case 'error': return '✗';
        default: return '';
    }
}

// UI functions
function showWelcomeMessage() {
    const welcomeDiv = messagesContainer.querySelector('.welcome-message');
    if (welcomeDiv) {
        welcomeDiv.style.display = 'flex';
    }
}

function hideWelcomeMessage() {
    const welcomeDiv = messagesContainer.querySelector('.welcome-message');
    if (welcomeDiv) {
        welcomeDiv.style.display = 'none';
    }
}

function showTypingIndicator() {
    if (!isTyping) {
        isTyping = true;
        typingIndicator.style.display = 'flex';
        scrollToBottom();
    }
}

function hideTypingIndicator() {
    isTyping = false;
    typingIndicator.style.display = 'none';
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateConnectionStatus(connected) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (connected) {
        statusIndicator.className = 'status-indicator online';
        statusText.textContent = 'Online';
    } else {
        statusIndicator.className = 'status-indicator offline';
        statusText.textContent = 'Offline';
    }
    
    sendButton.disabled = !connected;
}

// Theme functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme icon
    const themeIcon = document.querySelector('.btn-icon i');
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update theme icon
    const themeIcon = document.querySelector('.btn-icon i');
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Modal functions
function showHelp() {
    document.getElementById('helpModal').classList.add('show');
}

function showProjectCreator() {
    loadDesignSystems();
    document.getElementById('projectModal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function closeAllModals() {
    document.querySelectorAll('.modal.show').forEach(modal => {
        modal.classList.remove('show');
    });
}

function clearChat() {
    if (confirm('Are you sure you want to clear all messages?')) {
        messageHistory = [];
        socket.emit('clear_chat');
        renderMessageHistory();
    }
}

// Project creation
async function loadDesignSystems() {
    try {
        // This would normally call the server to get design systems
        // For now, we'll use a placeholder
        const select = document.getElementById('designSystem');
        select.innerHTML = '<option value="">Default</option>';
        
        // Simulate loading design systems
        socket.emit('send_message', { message: 'design systems', type: 'user' });
    } catch (error) {
        console.error('Failed to load design systems:', error);
    }
}

function createProject() {
    const description = document.getElementById('projectDescription').value.trim();
    const designSystem = document.getElementById('designSystem').value;
    
    if (!description) {
        alert('Please provide a project description');
        return;
    }
    
    let message = `create ${description}`;
    if (designSystem) {
        message += ` using design system ${designSystem}`;
    }
    
    closeModal('projectModal');
    sendQuickMessage(message);
    
    // Reset form
    document.getElementById('projectDescription').value = '';
    document.getElementById('designSystem').value = '';
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
