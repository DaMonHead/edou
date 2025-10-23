// Global variables
let patients = [];
let assessments = [];
let currentPatient = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadData();
    updateDashboard();
    setupEventListeners();
});

// Initialize application
function initializeApp() {
    // Set current date for assessment form
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('assessment-date').value = today;
    
    // Initialize navigation
    setupNavigation();
}

// Setup navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('screening-form').addEventListener('submit', handleFormSubmission);
    
    // Search functionality
    document.getElementById('search-patients').addEventListener('input', filterPatients);
    document.getElementById('filter-risk').addEventListener('change', filterPatients);
    
    // Modal close
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

// Load data from localStorage
function loadData() {
    const savedPatients = localStorage.getItem('sen-patients');
    const savedAssessments = localStorage.getItem('sen-assessments');
    
    if (savedPatients) {
        patients = JSON.parse(savedPatients);
    }
    
    if (savedAssessments) {
        assessments = JSON.parse(savedAssessments);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('sen-patients', JSON.stringify(patients));
    localStorage.setItem('sen-assessments', JSON.stringify(assessments));
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const assessmentData = {};
    
    // Collect form data
    for (let [key, value] of formData.entries()) {
        assessmentData[key] = value;
    }
    
    // Calculate risk level
    const riskLevel = calculateRiskLevel(assessmentData);
    assessmentData.riskLevel = riskLevel;
    assessmentData.id = generateId();
    assessmentData.timestamp = new Date().toISOString();
    
    // Add to assessments
    assessments.push(assessmentData);
    
    // Check if patient exists
    let patient = patients.find(p => 
        p.name === assessmentData.childName && 
        p.phone === assessmentData.parentPhone
    );
    
    if (!patient) {
        // Create new patient
        patient = {
            id: generateId(),
            name: assessmentData.childName,
            age: parseInt(assessmentData.childAge),
            gender: assessmentData.childGender,
            phone: assessmentData.parentPhone,
            parentName: assessmentData.parentName,
            createdAt: new Date().toISOString(),
            lastAssessment: assessmentData.timestamp,
            riskLevel: riskLevel
        };
        patients.push(patient);
    } else {
        // Update existing patient
        patient.age = parseInt(assessmentData.childAge);
        patient.lastAssessment = assessmentData.timestamp;
        patient.riskLevel = riskLevel;
    }
    
    // Save data
    saveData();
    
    // Update UI
    updateDashboard();
    updatePatientsTable();
    updateReports();
    
    // Show success message
    showNotification('評估已成功提交！', 'success');
    
    // Reset form
    e.target.reset();
    document.getElementById('assessment-date').value = new Date().toISOString().split('T')[0];
    
    // Switch to patients view
    switchToSection('patients');
}

// Calculate risk level based on assessment
function calculateRiskLevel(data) {
    const questions = [
        'language1', 'language2', 'social1', 'social2', 'cognitive1', 'cognitive2', 'behavior1', 'behavior2'
    ];
    
    let score = 0;
    const weights = {
        'excellent': 4,
        'good': 3,
        'fair': 2,
        'poor': 1
    };
    
    questions.forEach(question => {
        const value = data[question];
        if (value && weights[value]) {
            score += weights[value];
        }
    });
    
    const maxScore = questions.length * 4;
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 75) return 'low';
    if (percentage >= 50) return 'medium';
    return 'high';
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Update dashboard
function updateDashboard() {
    const totalPatients = patients.length;
    const completedAssessments = assessments.length;
    const highRiskCases = patients.filter(p => p.riskLevel === 'high').length;
    const today = new Date().toISOString().split('T')[0];
    const todayAssessments = assessments.filter(a => a.assessmentDate === today).length;
    
    document.getElementById('total-patients').textContent = totalPatients;
    document.getElementById('completed-assessments').textContent = completedAssessments;
    document.getElementById('high-risk-cases').textContent = highRiskCases;
    document.getElementById('today-assessments').textContent = todayAssessments;
    
    // Update recent activity
    updateRecentActivity();
}

// Update recent activity
function updateRecentActivity() {
    const activityList = document.getElementById('recent-activity-list');
    const recentAssessments = assessments.slice(-5).reverse();
    
    if (recentAssessments.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="activity-content">
                    <p>系統已準備就緒，可以開始進行 SEN 兒童篩查評估</p>
                    <span class="activity-time">剛剛</span>
                </div>
            </div>
        `;
        return;
    }
    
    activityList.innerHTML = recentAssessments.map(assessment => {
        const timeAgo = getTimeAgo(assessment.timestamp);
        return `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-clipboard-check"></i>
                </div>
                <div class="activity-content">
                    <p>完成 ${assessment.childName} 的 SEN 評估</p>
                    <span class="activity-time">${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Get time ago string
function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes} 分鐘前`;
    if (hours < 24) return `${hours} 小時前`;
    return `${days} 天前`;
}

// Update patients table
function updatePatientsTable() {
    const tbody = document.getElementById('patients-table-body');
    
    if (patients.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="7">
                    <div class="empty-message">
                        <i class="fas fa-users"></i>
                        <p>暫無患者資料</p>
                        <button class="btn-primary" onclick="addNewPatient()">新增第一個患者</button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = patients.map(patient => {
        const riskClass = patient.riskLevel || 'low';
        const riskText = {
            'low': '低風險',
            'medium': '中風險',
            'high': '高風險'
        };
        
        const lastAssessment = patient.lastAssessment ? 
            new Date(patient.lastAssessment).toLocaleDateString('zh-CN') : '無';
        
        return `
            <tr>
                <td>${patient.name}</td>
                <td>${patient.age} 歲</td>
                <td>${patient.gender === 'male' ? '男' : '女'}</td>
                <td>${patient.phone}</td>
                <td>${lastAssessment}</td>
                <td><span class="risk-badge ${riskClass}">${riskText[riskClass]}</span></td>
                <td>
                    <button class="btn-secondary" onclick="viewPatient('${patient.id}')">
                        <i class="fas fa-eye"></i>
                        查看
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter patients
function filterPatients() {
    const searchTerm = document.getElementById('search-patients').value.toLowerCase();
    const riskFilter = document.getElementById('filter-risk').value;
    
    const filteredPatients = patients.filter(patient => {
        const matchesSearch = !searchTerm || 
            patient.name.toLowerCase().includes(searchTerm) ||
            patient.phone.includes(searchTerm);
        
        const matchesRisk = !riskFilter || patient.riskLevel === riskFilter;
        
        return matchesSearch && matchesRisk;
    });
    
    updatePatientsTable(filteredPatients);
}

// Update patients table with filtered data
function updatePatientsTable(filteredPatients = null) {
    const tbody = document.getElementById('patients-table-body');
    const patientsToShow = filteredPatients || patients;
    
    if (patientsToShow.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="7">
                    <div class="empty-message">
                        <i class="fas fa-search"></i>
                        <p>沒有找到符合條件的患者</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = patientsToShow.map(patient => {
        const riskClass = patient.riskLevel || 'low';
        const riskText = {
            'low': '低風險',
            'medium': '中風險',
            'high': '高風險'
        };
        
        const lastAssessment = patient.lastAssessment ? 
            new Date(patient.lastAssessment).toLocaleDateString('zh-CN') : '無';
        
        return `
            <tr>
                <td>${patient.name}</td>
                <td>${patient.age} 歲</td>
                <td>${patient.gender === 'male' ? '男' : '女'}</td>
                <td>${patient.phone}</td>
                <td>${lastAssessment}</td>
                <td><span class="risk-badge ${riskClass}">${riskText[riskClass]}</span></td>
                <td>
                    <button class="btn-secondary" onclick="viewPatient('${patient.id}')">
                        <i class="fas fa-eye"></i>
                        查看
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update reports
function updateReports() {
    // Update assessment statistics
    document.getElementById('total-assessments').textContent = assessments.length;
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlyAssessments = assessments.filter(a => {
        const date = new Date(a.timestamp);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;
    document.getElementById('monthly-assessments').textContent = monthlyAssessments;
    
    // Update risk distribution
    const riskCounts = {
        low: patients.filter(p => p.riskLevel === 'low').length,
        medium: patients.filter(p => p.riskLevel === 'medium').length,
        high: patients.filter(p => p.riskLevel === 'high').length
    };
    
    const total = patients.length || 1;
    
    document.getElementById('low-risk-count').textContent = riskCounts.low;
    document.getElementById('medium-risk-count').textContent = riskCounts.medium;
    document.getElementById('high-risk-count').textContent = riskCounts.high;
    
    // Update risk bars
    const lowRiskBar = document.querySelector('.risk-item.low-risk .risk-fill');
    const mediumRiskBar = document.querySelector('.risk-item.medium-risk .risk-fill');
    const highRiskBar = document.querySelector('.risk-item.high-risk .risk-fill');
    
    if (lowRiskBar) lowRiskBar.style.width = `${(riskCounts.low / total) * 100}%`;
    if (mediumRiskBar) mediumRiskBar.style.width = `${(riskCounts.medium / total) * 100}%`;
    if (highRiskBar) highRiskBar.style.width = `${(riskCounts.high / total) * 100}%`;
    
    // Update age distribution
    const ageGroups = {
        '3-5': patients.filter(p => p.age >= 3 && p.age <= 5).length,
        '6-8': patients.filter(p => p.age >= 6 && p.age <= 8).length,
        '9-12': patients.filter(p => p.age >= 9 && p.age <= 12).length
    };
    
    const ageBars = document.querySelectorAll('.age-fill');
    const ageCounts = document.querySelectorAll('.age-count');
    
    ageBars.forEach((bar, index) => {
        const counts = Object.values(ageGroups);
        const maxCount = Math.max(...counts, 1);
        const percentage = (counts[index] / maxCount) * 100;
        bar.style.width = `${percentage}%`;
    });
    
    ageCounts.forEach((count, index) => {
        const counts = Object.values(ageGroups);
        count.textContent = counts[index];
    });
    
    // Update recent assessments
    updateRecentAssessments();
}

// Update recent assessments
function updateRecentAssessments() {
    const recentList = document.getElementById('recent-assessments-list');
    const recentAssessments = assessments.slice(-5).reverse();
    
    if (recentAssessments.length === 0) {
        recentList.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-clipboard-list"></i>
                <p>暫無評估記錄</p>
            </div>
        `;
        return;
    }
    
    recentList.innerHTML = recentAssessments.map(assessment => {
        const riskClass = assessment.riskLevel || 'low';
        const riskText = {
            'low': '低風險',
            'medium': '中風險',
            'high': '高風險'
        };
        
        const date = new Date(assessment.timestamp).toLocaleDateString('zh-CN');
        
        return `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${assessment.childName}</strong> - ${riskText[riskClass]}</p>
                    <span class="activity-time">${date}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Navigation functions
function switchToSection(sectionName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update sections
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionName).classList.add('active');
    
    // Update data if needed
    if (sectionName === 'patients') {
        updatePatientsTable();
    } else if (sectionName === 'reports') {
        updateReports();
    }
}

// Quick action functions
function startNewAssessment() {
    switchToSection('screening');
}

function viewRecentPatients() {
    switchToSection('patients');
}

function generateReport() {
    switchToSection('reports');
}

// Patient management functions
function addNewPatient() {
    switchToSection('screening');
}

function viewPatient(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    
    currentPatient = patient;
    
    const modal = document.getElementById('patient-modal');
    const content = document.getElementById('patient-detail-content');
    
    const patientAssessments = assessments.filter(a => 
        a.childName === patient.name && a.parentPhone === patient.phone
    );
    
    const riskText = {
        'low': '低風險',
        'medium': '中風險',
        'high': '高風險'
    };
    
    content.innerHTML = `
        <div class="patient-detail">
            <div class="patient-info">
                <h4>基本資料</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <label>姓名</label>
                        <span>${patient.name}</span>
                    </div>
                    <div class="info-item">
                        <label>年齡</label>
                        <span>${patient.age} 歲</span>
                    </div>
                    <div class="info-item">
                        <label>性別</label>
                        <span>${patient.gender === 'male' ? '男' : '女'}</span>
                    </div>
                    <div class="info-item">
                        <label>聯絡電話</label>
                        <span>${patient.phone}</span>
                    </div>
                    <div class="info-item">
                        <label>家長姓名</label>
                        <span>${patient.parentName || '未提供'}</span>
                    </div>
                    <div class="info-item">
                        <label>風險等級</label>
                        <span class="risk-badge ${patient.riskLevel}">${riskText[patient.riskLevel]}</span>
                    </div>
                </div>
            </div>
            
            <div class="patient-assessments">
                <h4>評估記錄 (${patientAssessments.length} 次)</h4>
                ${patientAssessments.length === 0 ? 
                    '<p class="no-assessments">暫無評估記錄</p>' :
                    patientAssessments.map(assessment => `
                        <div class="assessment-item">
                            <div class="assessment-header">
                                <span class="assessment-date">${new Date(assessment.timestamp).toLocaleDateString('zh-CN')}</span>
                                <span class="risk-badge ${assessment.riskLevel}">${riskText[assessment.riskLevel]}</span>
                            </div>
                            <div class="assessment-details">
                                <p><strong>語言發展:</strong> ${getAssessmentScore(assessment, 'language')}</p>
                                <p><strong>社交互動:</strong> ${getAssessmentScore(assessment, 'social')}</p>
                                <p><strong>認知能力:</strong> ${getAssessmentScore(assessment, 'cognitive')}</p>
                                <p><strong>行為評估:</strong> ${getAssessmentScore(assessment, 'behavior')}</p>
                                ${assessment.additionalNotes ? `<p><strong>備註:</strong> ${assessment.additionalNotes}</p>` : ''}
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Get assessment score for a category
function getAssessmentScore(assessment, category) {
    const scores = {
        'language': ['language1', 'language2'],
        'social': ['social1', 'social2'],
        'cognitive': ['cognitive1', 'cognitive2'],
        'behavior': ['behavior1', 'behavior2']
    };
    
    const questions = scores[category];
    if (!questions) return '未評估';
    
    const values = questions.map(q => assessment[q]).filter(v => v);
    if (values.length === 0) return '未評估';
    
    const scoreMap = {
        'excellent': 4,
        'good': 3,
        'fair': 2,
        'poor': 1
    };
    
    const totalScore = values.reduce((sum, val) => sum + (scoreMap[val] || 0), 0);
    const avgScore = totalScore / values.length;
    
    if (avgScore >= 3.5) return '優秀';
    if (avgScore >= 2.5) return '良好';
    if (avgScore >= 1.5) return '一般';
    return '需要關注';
}

// Modal functions
function closeModal() {
    document.getElementById('patient-modal').style.display = 'none';
    currentPatient = null;
}

// Utility functions
function saveDraft() {
    showNotification('草稿已儲存！', 'info');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Export data function
function exportData() {
    const data = {
        patients: patients,
        assessments: assessments,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sen-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('資料已匯出！', 'success');
}

// Import data function
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.patients && data.assessments) {
                patients = data.patients;
                assessments = data.assessments;
                saveData();
                updateDashboard();
                updatePatientsTable();
                updateReports();
                showNotification('資料已匯入！', 'success');
            } else {
                showNotification('檔案格式不正確！', 'error');
            }
        } catch (error) {
            showNotification('匯入失敗！', 'error');
        }
    };
    reader.readAsText(file);
}

// Add export/import functionality to reports section
document.addEventListener('DOMContentLoaded', function() {
    // Add export/import buttons to reports section
    const reportsHeader = document.querySelector('#reports .section-header .header-actions');
    if (reportsHeader) {
        reportsHeader.innerHTML += `
            <button class="btn-secondary" onclick="exportData()">
                <i class="fas fa-download"></i>
                匯出資料
            </button>
            <label class="btn-secondary" style="cursor: pointer;">
                <i class="fas fa-upload"></i>
                匯入資料
                <input type="file" accept=".json" onchange="importData(event)" style="display: none;">
            </label>
        `;
    }
});
