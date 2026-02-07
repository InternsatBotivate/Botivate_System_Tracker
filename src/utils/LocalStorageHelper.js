export const STORAGE_KEYS = {
    SYSTEMS: 'botivate_systems_data',
    USERS: 'botivate_users_data',
    CURRENT_USER: 'botivate_current_user'
};

// Seed dummy users if not exist
export const seedUsers = () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const defaultUsers = [
            { id: 'U-001', name: 'Admin User', role: 'admin', password: 'admin123' },
            { id: 'U-002', name: 'Client User', role: 'client', password: 'client123' }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
};

// Generate Serial Number (SN-001, SN-002)
export const generateSerialNo = () => {
    const count = systems.length + 1;
    return `SN-${String(count).padStart(3, '0')}`;
};

// Calculate Delay (Days from Date string DD/MM/YYYY to Now)
export const calculateDelay = (dateStr) => {
    if (!dateStr) return 0;
    try {
        const [day, month, year] = dateStr.split('/');
        const startDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    } catch (e) {
        return 0;
    }
};

// LocalStorage Utils
export const LocalStorageHelper = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage', error);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage', error);
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

export const seedSystemData = () => {
    const dummyData = [
        // --- COMPLETED SYSTEMS (Stage 12 - All Done) ---
        {
            serialNo: "SN-001", requirementDate: "01/01/2025", currentStage: 12,
            systemName: "HR Management Portal", processSystem: "Web App", reason: "Automate payroll and attendance.", anyLink: "https://example.com/hrms",
            history: {
                1: { postedBy: "Admin", requirementDate: "01/01/2025" },
                2: { requirementUnderstandingBy: "Admin", remarks: "Clear requirements gathered from HR layer.", uploadImage: "https://via.placeholder.com/150" },
                3: { designCreateBy: "Admin", designExplainTo: "HR Manager", urlOfDesign: "https://figma.com/sample1" },
                4: { takeUpdateFrom: "Client", remarks: "Design approved with minor tweaks regarding color scheme." },
                5: { finalApprovalBy: "Client", approvalStatus: "Approved", finalRemarks: "Proceed to development immediately." },
                6: { testedBy: "QA Team", testingResult: "Pass", bugCount: 0, bugNotes: "No critical bugs found.", testingDate: "15/01/2025" },
                7: { reviewedBy: "Lead Dev", codeQualityRating: "Excellent", securityCheck: "Pass", performanceNotes: "Optimized for 10k users.", reviewRemarks: "Code is clean and modular." },
                8: { trainingGivenBy: "Admin", trainingMode: "Online", trainingDuration: "4", trainingFeedback: "Users understood the flow well.", userReadiness: "Ready" },
                9: { goLiveDoneBy: "DevOps", deploymentType: "Production", goLiveDate: "20/01/2025", postGoLiveStatus: "Smooth", initialSupportNotes: "Monitoring for 24 hours." },
                10: { indexedBy: "Admin", systemCategory: "Internal Tool", indexReferenceCode: "HR-2025-01", documentationLink: "https://docs.internal/hr" },
                11: { misIntegratedBy: "Data Team", misModuleName: "Payroll", integrationStatus: "Completed", misReferenceId: "MIS-HR-01", reportingEnabled: "Yes", integrationRemarks: "Data syncing perfectly." }
            }
        },
        {
            serialNo: "SN-002", requirementDate: "02/01/2025", currentStage: 12,
            systemName: "Customer Support Bot", processSystem: "AI Tool", reason: "Handle L1 customer queries automatically.", anyLink: "https://example.com/bot",
            history: {
                1: { postedBy: "Manager", requirementDate: "02/01/2025" },
                2: { requirementUnderstandingBy: "Admin", remarks: "Understood flow for intents.", uploadImage: "" },
                3: { designCreateBy: "Designer", designExplainTo: "Ops Head", urlOfDesign: "https://figma.com/bot" },
                4: { takeUpdateFrom: "Client", remarks: "Added more intents for billing." },
                5: { finalApprovalBy: "Client", approvalStatus: "Approved", finalRemarks: "Looks good." },
                6: { testedBy: "QA", testingResult: "Pass", bugCount: 2, bugNotes: "Minor UI glitches fixed.", testingDate: "18/01/2025" },
                7: { reviewedBy: "Senior Dev", codeQualityRating: "Good", securityCheck: "Pass", performanceNotes: "Response time < 200ms.", reviewRemarks: "Standard adherence is good." },
                8: { trainingGivenBy: "Trainer", trainingMode: "Hybrid", trainingDuration: "8", trainingFeedback: "AI responses were accurate.", userReadiness: "Ready" },
                9: { goLiveDoneBy: "DevOps", deploymentType: "Beta", goLiveDate: "22/01/2025", postGoLiveStatus: "Smooth", initialSupportNotes: "Beta group active." },
                10: { indexedBy: "Admin", systemCategory: "Automation", indexReferenceCode: "AI-2025-02", documentationLink: "https://docs.internal/ai-bot" },
                11: { misIntegratedBy: "Data Team", misModuleName: "Support", integrationStatus: "Completed", misReferenceId: "MIS-SUP-02", reportingEnabled: "Yes", integrationRemarks: "Logs integrated." }
            }
        },

        // --- PENDING STAGE 11 (MIS Integration) ---
        // Finished Stage 10
        {
            serialNo: "SN-003", requirementDate: "05/01/2025", currentStage: 11,
            systemName: "Finance Dashboard", processSystem: "Web App", reason: "Visualize expenses and revenue.",
            history: {
                1: { postedBy: "CFO", requirementDate: "05/01/2025" },
                2: { requirementUnderstandingBy: "BA", remarks: "Key metrics identified.", uploadImage: "" },
                3: { designCreateBy: "UX Lead", designExplainTo: "Finance Team", urlOfDesign: "https://figma.com/fin" },
                4: { takeUpdateFrom: "CFO", remarks: "Add forecast charts." },
                5: { finalApprovalBy: "CFO", approvalStatus: "Approved", finalRemarks: "Perfect." },
                6: { testedBy: "QA", testingResult: "Pass", bugCount: 1, bugNotes: "Data label fix.", testingDate: "20/01/2025" },
                7: { reviewedBy: "Tech Lead", codeQualityRating: "Excellent", securityCheck: "Pass", performanceNotes: "Query optimized.", reviewRemarks: "Good job." },
                8: { trainingGivenBy: "Trainer", trainingMode: "Offline", trainingDuration: "2", trainingFeedback: "Easy to use.", userReadiness: "Ready" },
                9: { goLiveDoneBy: "DevOps", deploymentType: "Production", goLiveDate: "25/01/2025", postGoLiveStatus: "Smooth", initialSupportNotes: "None." },
                10: { indexedBy: "Admin", systemCategory: "Internal", indexReferenceCode: "FIN-01", documentationLink: "https://docs/fin" }
            }
        },

        // --- PENDING STAGE 10 (System Indexing) ---
        // Finished Stage 9
        {
            serialNo: "SN-004", requirementDate: "08/01/2025", currentStage: 10,
            systemName: "Inventory Mobile App", processSystem: "Mobile App", reason: "Field staff usage for stock taking.",
            history: {
                1: { postedBy: "Ops", requirementDate: "08/01/2025" },
                2: { requirementUnderstandingBy: "Admin", remarks: "Scanner integration needed.", uploadImage: "" },
                3: { designCreateBy: "UI", designExplainTo: "Field Mgr", urlOfDesign: "https://figma.com/inv" },
                4: { takeUpdateFrom: "Ops", remarks: "Bigger buttons for gloves." },
                5: { finalApprovalBy: "Ops Head", approvalStatus: "Approved", finalRemarks: "Approved." },
                6: { testedBy: "QA Mob", testingResult: "Pass", bugCount: 3, bugNotes: "Camera permission fix.", testingDate: "22/01/2025" },
                7: { reviewedBy: "Mobile Lead", codeQualityRating: "Good", securityCheck: "Pass", performanceNotes: "Battery efficient.", reviewRemarks: "Clean." },
                8: { trainingGivenBy: "Superv", trainingMode: "On-site", trainingDuration: "1", trainingFeedback: "Fast.", userReadiness: "Ready" },
                9: { goLiveDoneBy: "DevOps", deploymentType: "Production", goLiveDate: "28/01/2025", postGoLiveStatus: "Smooth", initialSupportNotes: "Rollout started." }
            }
        },

        // --- PENDING STAGE 9 (Go Live) ---
        // Finished Stage 8
        {
            serialNo: "SN-005", requirementDate: "10/01/2025", currentStage: 9,
            systemName: "Employee Onboarding", processSystem: "Workflow", reason: "Streamline joining process.",
            history: {
                1: { postedBy: "HR", requirementDate: "10/01/2025" },
                2: { requirementUnderstandingBy: "BA", remarks: "Digital forms needed.", uploadImage: "" },
                3: { designCreateBy: "UX", designExplainTo: "HR", urlOfDesign: "https://figma.com/onboard" },
                4: { takeUpdateFrom: "HR", remarks: "Add document upload." },
                5: { finalApprovalBy: "HR Head", approvalStatus: "Approved", finalRemarks: "Go." },
                6: { testedBy: "QA", testingResult: "Pass", bugCount: 0, bugNotes: "Clean.", testingDate: "24/01/2025" },
                7: { reviewedBy: "Lead", codeQualityRating: "Good", securityCheck: "Pass", performanceNotes: "OK.", reviewRemarks: "Standard." },
                8: { trainingGivenBy: "HR Lead", trainingMode: "Online", trainingDuration: "3", trainingFeedback: "Very intuitive.", userReadiness: "Ready" }
            }
        },

        // --- PENDING STAGE 8 (User Training) ---
        // Finished Stage 7
        {
            serialNo: "SN-006", requirementDate: "12/01/2025", currentStage: 8,
            systemName: "Sales CRM v2", processSystem: "CRM", reason: "Upgrade legacy system.",
            history: {
                1: { postedBy: "Sales", requirementDate: "12/01/2025" },
                2: { requirementUnderstandingBy: "BA", remarks: "Pipeline view priority.", uploadImage: "" },
                3: { designCreateBy: "UX", designExplainTo: "Sales Head", urlOfDesign: "https://figma.com/crm" },
                4: { takeUpdateFrom: "Sales", remarks: "Mobile view critical." },
                5: { finalApprovalBy: "Sales VP", approvalStatus: "Approved", finalRemarks: "Deploy ASAP." },
                6: { testedBy: "QA", testingResult: "Pass", bugCount: 10, bugNotes: "All critical fixed.", testingDate: "26/01/2025" },
                7: { reviewedBy: "Lead Dev", codeQualityRating: "Good", securityCheck: "Pass", performanceNotes: "Database indexed.", reviewRemarks: "Solid codebase." }
            }
        },

        // --- PENDING STAGE 7 (Code Review) ---
        // Finished Stage 6
        {
            serialNo: "SN-007", requirementDate: "15/01/2025", currentStage: 7,
            systemName: "Visitor Gate Pass", processSystem: "Kiosk", reason: "Security tracking.",
            history: {
                1: { postedBy: "Security", requirementDate: "15/01/2025" },
                2: { requirementUnderstandingBy: "Admin", remarks: "Touchscreen interface.", uploadImage: "" },
                3: { designCreateBy: "UI", designExplainTo: "Sec Head", urlOfDesign: "https://figma.com/gate" },
                4: { takeUpdateFrom: "Sec", remarks: "Photo capture needed." },
                5: { finalApprovalBy: "Admin", approvalStatus: "Approved", finalRemarks: "Approve." },
                6: { testedBy: "QA 1", testingResult: "Pass", bugCount: 0, bugNotes: "No bugs found.", testingDate: "28/01/2025" }
            }
        },

        // --- PENDING STAGE 6 (Testing) ---
        // Finished Stage 5
        {
            serialNo: "SN-008", requirementDate: "18/01/2025", currentStage: 6,
            systemName: "Meeting Room Booking", processSystem: "Web App", reason: "Avoid conflicts.",
            history: {
                1: { postedBy: "Admin", requirementDate: "18/01/2025" },
                2: { requirementUnderstandingBy: "Admin", remarks: "Calendar view.", uploadImage: "" },
                3: { designCreateBy: "UX", designExplainTo: "Admin", urlOfDesign: "https://figma.com/meet" },
                4: { takeUpdateFrom: "Staff", remarks: "Outlook sync." },
                5: { finalApprovalBy: "Office Admin", approvalStatus: "Approved", finalRemarks: "Approved for build." }
            }
        },

        // --- PENDING STAGE 5 (Final Design Approval) ---
        // Finished Stage 4
        {
            serialNo: "SN-009", requirementDate: "20/01/2025", currentStage: 5,
            systemName: "Asset Tracker", processSystem: "Web App", reason: "Laptop tracking.",
            history: {
                1: { postedBy: "IT", requirementDate: "20/01/2025" },
                2: { requirementUnderstandingBy: "IT Admin", remarks: "Serial scanning.", uploadImage: "" },
                3: { designCreateBy: "UI", designExplainTo: "IT", urlOfDesign: "https://figma.com/asset" },
                4: { takeUpdateFrom: "IT Head", remarks: "Added warranty alerts." }
            }
        },

        // --- PENDING STAGE 4 (Design Update) ---
        // Finished Stage 3
        {
            serialNo: "SN-010", requirementDate: "22/01/2025", currentStage: 4,
            systemName: "Knowledge Base", processSystem: "Wiki", reason: "Documentation central.",
            history: {
                1: { postedBy: "HR", requirementDate: "22/01/2025" },
                2: { requirementUnderstandingBy: "Content Lead", remarks: "Searchable.", uploadImage: "" },
                3: { designCreateBy: "UX Team", designExplainTo: "HR", urlOfDesign: "https://figma.com/kb" }
            }
        },

        // --- PENDING STAGE 3 (Sample Design) ---
        // Finished Stage 2
        {
            serialNo: "SN-011", requirementDate: "24/01/2025", currentStage: 3,
            systemName: "Performance Review", processSystem: "Web App", reason: "Yearly appraisal.",
            history: {
                1: { postedBy: "HR", requirementDate: "24/01/2025" },
                2: { requirementUnderstandingBy: "Admin", remarks: "Understood standard 360 flow.", uploadImage: "" }
            }
        },

        // --- PENDING STAGE 2 (Requirement Understanding) ---
        // Finished Stage 1 (Created)
        {
            serialNo: "SN-012", requirementDate: "26/01/2025", currentStage: 2,
            systemName: "Event Planner", processSystem: "Tool", reason: "Company offsites.",
            history: {
                1: { postedBy: "Admin", requirementDate: "26/01/2025" }
            }
        }
    ];

    localStorage.setItem(STORAGE_KEYS.SYSTEMS, JSON.stringify(dummyData));
    return dummyData;
};
