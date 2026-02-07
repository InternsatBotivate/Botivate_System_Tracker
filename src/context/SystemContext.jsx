import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LocalStorageHelper, STORAGE_KEYS, generateSerialNo, seedSystemData } from '../utils/LocalStorageHelper';

const SystemContext = createContext(null);

export const STAGES = {
    REQUIREMENT_UPDATE: 1,
    REQUIREMENT_UNDERSTANDING: 2,
    SAMPLE_DESIGN: 3,
    DESIGN_UPDATE: 4,
    FINAL_DESIGN_APPROVAL: 5,
    TESTING: 6,
    CODE_REVIEW: 7,
    USER_TRAINING: 8,
    GO_LIVE: 9,
    SYSTEM_INDEXING: 10,
    MIS_INTEGRATION: 11
};

export const STAGE_NAMES = {
    1: 'Requirement Update',
    2: 'Requirement Understanding',
    3: 'Sample Design',
    4: 'Design Update',
    5: 'Final Design Approval',
    6: 'Testing',
    7: 'Code Review',
    8: 'User Training',
    9: 'Go Live',
    10: 'System Indexing',
    11: 'MIS Integration'
};

export const SystemProvider = ({ children }) => {
    const [systems, setSystems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        let data = LocalStorageHelper.get(STORAGE_KEYS.SYSTEMS);

        // Seed if empty
        if (!data || data.length === 0) {
            data = seedSystemData();
        }

        setSystems(data);
        setLoading(false);
    }, []);

    // Save changes
    useEffect(() => {
        if (!loading) {
            LocalStorageHelper.set(STORAGE_KEYS.SYSTEMS, systems);
        }
    }, [systems, loading]);

    const addRequirement = (data) => {
        const newSystem = {
            serialNo: generateSerialNo(), // SN-001
            requirementDate: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
            currentStage: STAGES.REQUIREMENT_UNDERSTANDING, // Moves to next stage pending immediately
            history: {
                [STAGES.REQUIREMENT_UPDATE]: data
            },
            ...data
        };

        setSystems(prev => [...prev, newSystem]);
        return newSystem;
    };

    const updateSystemStage = (serialNo, stageId, data) => {
        setSystems(prev => prev.map(sys => {
            // Ensure we are updating the correct system
            if (sys.serialNo === serialNo) {
                return {
                    ...sys,
                    currentStage: stageId + 1, // Move to next stage
                    history: {
                        ...sys.history,
                        [stageId]: { ...sys.history[stageId], ...data }
                    },
                    // Spread data to top level for easy access if needed, but history is source of truth for each stage
                    ...data
                };
            }
            return sys;
        }));
    };

    // Get items pending for a specific stage
    // For Stage 1 (Requirement Update), it's "New Entry" mode, so no "Pending" list in the same sense usually?
    // User says: "Stage 1... Button Add Requirement... History Table"
    // Actually Stage 1 has a table? "Store in LocalStorage table... Table headers..."
    // So Stage 1 view shows ALL systems that have been created (History of Stage 1).

    // For Stage 2 Pending: It needs to show items that are currently AT Stage 2.
    const getPendingForStage = (stageId) => {
        return systems.filter(sys => sys.currentStage === stageId);
    };

    // For Stage X History: It needs to show items that have completed Stage X.
    // i.e. currentStage > stageId
    const getHistoryForStage = (stageId) => {
        // Special case for Stage 1: Its history is basically everything that exists
        if (stageId === STAGES.REQUIREMENT_UPDATE) {
            return systems;
        }
        return systems.filter(sys => sys.currentStage > stageId);
    };

    const resetSystem = () => {
        setSystems([]);
        LocalStorageHelper.remove(STORAGE_KEYS.SYSTEMS);
        // Also reset serial counter logic if needed, but generateSerialNo calculates from length of systems, so it's fine.
    };

    const value = {
        systems,
        loading,
        addRequirement,
        updateSystemStage,
        getPendingForStage,
        getHistoryForStage,
        resetSystem
    };

    return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
};

SystemProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
};

export default SystemContext;
