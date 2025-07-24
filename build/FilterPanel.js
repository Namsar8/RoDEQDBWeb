import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';

const CLASSES = [
    '(any)', 'Mage', 'Cleric', 'Thief', 'Warrior', 'Vampire', 'Druid', 
    'Ranger', 'Augurer', 'Paladin', 'Nephandi', 'Fathomer', 'Bladesinger', 'Barbarian'
];

const RACES = [
    '(any)', 'Human', 'Dwarf', 'Elf', 'Halfling', 'Pixie', 'Half-Elf', 'Half-Ogre',
    'Half-Orc', 'Half-Troll', 'Gith', 'Sea-Elf', 'Drow', 'Lizardman', 'Gnome', 'Dragonborn', 'Tiefling'
];

const ALIGNMENTS = ['(any)', 'Good', 'Evil', 'Neutral'];
const SEXES = ['(any)', 'Male', 'Neutral', 'Female'];

export const FilterPanel = ({ schema, onSearch }) => {
    const [playerClass, setPlayerClass] = useState('(any)');
    const [race, setRace] = useState('(any)');
    const [alignment, setAlignment] = useState('(any)');
    const [sex, setSex] = useState('(any)');
    const [constraints, setConstraints] = useState({


        pkill: null,
        gloried: null,
        notInGame: null,
        allowOnlyOneUnique: false,
        newlyAddedItems: false,
        recentlyEditedItems: false,
        minLv: null,
        maxLv: null,
        minAC: null,
        maxAC: null,
        minD1: null,
        maxD1: null,
        minD2: null,
        maxD2: null,
        minST: null,
        maxST: null,
        minDE: null,
        maxDE: null,
        minCO: null,
        maxCO: null,
        minIN: null,
        maxIN: null,
        minWI: null,
        maxWI: null,
        minLK: null,
        maxLK: null,
        minCH: null,
        maxCH: null,
    });

    const handleConstraintChange = (key, value) => {
        setConstraints(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const filterData = {
            class: playerClass,
            race,
            alignment,
            sex,
            ...constraints
        };
        
        if (window.applyReactFilters) {
            window.applyReactFilters(filterData);
        }
    };

    const resetFilters = () => {
        setPlayerClass('(any)');
        setRace('(any)');
        setAlignment('(any)');
        setSex('(any)');
        setConstraints({
            pkill: null,
            gloried: null,
            notInGame: null,
            allowOnlyOneUnique: false,
            newlyAddedItems: false,
            recentlyEditedItems: false,
            minLv: null,
            maxLv: null,
            minAC: null,
            maxAC: null,
            minD1: null,
            maxD1: null,
            minD2: null,
            maxD2: null,
            minST: null,
            maxST: null,
            minDE: null,
            maxDE: null,
            minCO: null,
            maxCO: null,
            minIN: null,
            maxIN: null,
            minWI: null,
            maxWI: null,
            minLK: null,
            maxLK: null,
            minCH: null,
            maxCH: null,
        });
    };

    // Make reset function available globally
    window.resetReactFilters = resetFilters;

    return _jsxs("div", {
        style: { 
            fontFamily: 'Consolas, Courier New, monospace', 
            fontSize: '0.75rem',
            display: 'grid',
            gridTemplateColumns: '110px 100px 1fr',
            gap: '10px',
            padding: '10px'
        },
        children: [
            // Class column
            _jsxs("div", {
                children: [
                    _jsx("h3", { 
                        style: { 
                            margin: '0 0 5px 0', 
                            fontSize: '0.8rem', 
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            borderBottom: '1px solid #ddd',
                            paddingBottom: '2px'
                        }, 
                        children: "Class" 
                    }),
                    _jsx("div", {
                        style: { display: 'flex', flexDirection: 'column', gap: '1px' },
                        children: CLASSES.map((cls, index) => 
                            _jsxs("label", {
                                style: { 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '4px',
                                    cursor: 'pointer',
                                    padding: '1px 0',
                                    fontSize: '0.75rem'
                                },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "class",
                                        value: cls,
                                        checked: playerClass === cls,
                                        onChange: (e) => setPlayerClass(e.target.value),
                                        style: { margin: 0, transform: 'scale(0.8)' }
                                    }),
                                    cls
                                ]
                            }, index)
                        )
                    })
                ]
            }),

            // Race column
            _jsxs("div", {
                children: [
                    _jsx("h3", { 
                        style: { 
                            margin: '0 0 5px 0', 
                            fontSize: '0.8rem', 
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            borderBottom: '1px solid #ddd',
                            paddingBottom: '2px'
                        }, 
                        children: "Race" 
                    }),
                    _jsx("div", {
                        style: { display: 'flex', flexDirection: 'column', gap: '1px' },
                        children: RACES.map((raceOption, index) => 
                            _jsxs("label", {
                                style: { 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '4px',
                                    cursor: 'pointer',
                                    padding: '1px 0',
                                    fontSize: '0.75rem'
                                },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "race",
                                        value: raceOption,
                                        checked: race === raceOption,
                                        onChange: (e) => setRace(e.target.value),
                                        style: { margin: 0, transform: 'scale(0.8)' }
                                    }),
                                    raceOption
                                ]
                            }, index)
                        )
                    }),
                    
                    // Alignment section
                    _jsx("div", { style: { marginTop: '15px' }, children: 
                        _jsxs("div", {
                            children: [
                                _jsx("h3", { 
                                    style: { 
                                        margin: '0 0 5px 0', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 'bold',
                                        color: '#2c3e50',
                                        borderBottom: '1px solid #ddd',
                                        paddingBottom: '2px'
                                    }, 
                                    children: "Align" 
                                }),
                                _jsx("div", {
                                    style: { display: 'flex', flexDirection: 'column', gap: '1px' },
                                    children: ALIGNMENTS.map((align, index) => 
                                        _jsxs("label", {
                                            style: { 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '4px',
                                                cursor: 'pointer',
                                                padding: '1px 0',
                                                fontSize: '0.75rem'
                                            },
                                            children: [
                                                _jsx("input", {
                                                    type: "radio",
                                                    name: "alignment",
                                                    value: align,
                                                    checked: alignment === align,
                                                    onChange: (e) => setAlignment(e.target.value),
                                                    style: { margin: 0, transform: 'scale(0.8)' }
                                                }),
                                                align
                                            ]
                                        }, index)
                                    )
                                })
                            ]
                        })
                    }),

                    // Sex section
                    _jsx("div", { style: { marginTop: '15px' }, children: 
                        _jsxs("div", {
                            children: [
                                _jsx("h3", { 
                                    style: { 
                                        margin: '0 0 5px 0', 
                                        fontSize: '0.8rem', 
                                        fontWeight: 'bold',
                                        color: '#2c3e50',
                                        borderBottom: '1px solid #ddd',
                                        paddingBottom: '2px'
                                    }, 
                                    children: "Sex" 
                                }),
                                _jsx("div", {
                                    style: { display: 'flex', flexDirection: 'column', gap: '1px' },
                                    children: SEXES.map((sexOption, index) => 
                                        _jsxs("label", {
                                            style: { 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '4px',
                                                cursor: 'pointer',
                                                padding: '1px 0',
                                                fontSize: '0.75rem'
                                            },
                                            children: [
                                                _jsx("input", {
                                                    type: "radio",
                                                    name: "sex",
                                                    value: sexOption,
                                                    checked: sex === sexOption,
                                                    onChange: (e) => setSex(e.target.value),
                                                    style: { margin: 0, transform: 'scale(0.8)' }
                                                }),
                                                sexOption
                                            ]
                                        }, index)
                                    )
                                })
                            ]
                        })
                    })
                ]
            }),

            // Constraints column
            _jsxs("div", {
                children: [
                    _jsx("h3", { 
                        style: { 
                            margin: '0 0 8px 0', 
                            fontSize: '0.8rem', 
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            borderBottom: '1px solid #ddd',
                            paddingBottom: '2px'
                        }, 
                        children: "Constraints" 
                    }),
                    
                    _jsx("div", {
                        style: { 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '6px',
                            fontSize: '0.75rem'
                        },
                        children: [

                            // PK/Non-PK
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "pkillFilter",
                                        checked: constraints.pkill === true,
                                        onChange: () => handleConstraintChange("pkill", true),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "PK"
                                ]
                            }),
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "pkillFilter",
                                        checked: constraints.pkill === false,
                                        onChange: () => handleConstraintChange("pkill", false),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "Non-PK"
                                ]
                            }),
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "pkillFilter",
                                        checked: constraints.pkill === null,
                                        onChange: () => handleConstraintChange("pkill", null),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "Any PK"
                                ]
                            }),

                            // Gloried/Non-Gloried
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "gloriedFilter",
                                        checked: constraints.gloried === true,
                                        onChange: () => handleConstraintChange("gloried", true),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "Gloried"
                                ]
                            }),
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "gloriedFilter",
                                        checked: constraints.gloried === false,
                                        onChange: () => handleConstraintChange("gloried", false),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "Non-Gloried"
                                ]
                            }),
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "gloriedFilter",
                                        checked: constraints.gloried === null,
                                        onChange: () => handleConstraintChange("gloried", null),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "Any Gloried"
                                ]
                            }),

                            // OOG/In-Game
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "notInGameFilter",
                                        checked: constraints.notInGame === true,
                                        onChange: () => handleConstraintChange("notInGame", true),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "Out of Game"
                                ]
                            }),
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "notInGameFilter",
                                        checked: constraints.notInGame === false,
                                        onChange: () => handleConstraintChange("notInGame", false),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "In Game"
                                ]
                            }),
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "radio",
                                        name: "notInGameFilter",
                                        checked: constraints.notInGame === null,
                                        onChange: () => handleConstraintChange("notInGame", null),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "Any Game Status"
                                ]
                            }),

                            // Unique constraint
                            _jsxs("label", {
                                style: { 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "4px", 
                                    cursor: "pointer",
                                    gridColumn: "1 / -1"
                                },
                                children: [
                                    _jsx("input", {
                                        type: "checkbox",
                                        checked: constraints.allowOnlyOneUnique,
                                        onChange: (e) => handleConstraintChange("allowOnlyOneUnique", e.target.checked),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "Allow only one Unique"
                                ]
                            }),
                            
                            // Recently added/edited
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "checkbox",
                                        checked: constraints.newlyAddedItems,
                                        onChange: (e) => handleConstraintChange("newlyAddedItems", e.target.checked),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "Newly Added Items"
                                ]
                            }),
                            _jsxs("label", {
                                style: { display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" },
                                children: [
                                    _jsx("input", {
                                        type: "checkbox",
                                        checked: constraints.recentlyEditedItems,
                                        onChange: (e) => handleConstraintChange("recentlyEditedItems", e.target.checked),
                                        style: { transform: "scale(0.8)", margin: 0 }
                                    }),
                                    "Recently Edited Items"
                                ]
                            }),

                            // Level Range
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "Lv:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minLv === null ? "" : constraints.minLv,
                                        onChange: (e) => handleConstraintChange("minLv", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxLv === null ? "" : constraints.maxLv,
                                        onChange: (e) => handleConstraintChange("maxLv", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),

                            // AC Range
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "AC:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minAC === null ? "" : constraints.minAC,
                                        onChange: (e) => handleConstraintChange("minAC", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxAC === null ? "" : constraints.maxAC,
                                        onChange: (e) => handleConstraintChange("maxAC", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),

                            // Damage Range (d1/d2)
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "d1:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minD1 === null ? "" : constraints.minD1,
                                        onChange: (e) => handleConstraintChange("minD1", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxD1 === null ? "" : constraints.maxD1,
                                        onChange: (e) => handleConstraintChange("maxD1", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "d2:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minD2 === null ? "" : constraints.minD2,
                                        onChange: (e) => handleConstraintChange("minD2", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxD2 === null ? "" : constraints.maxD2,
                                        onChange: (e) => handleConstraintChange("maxD2", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),

                            // Stat Ranges (ST, DE, CO, IN, WI, LK, CH)
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "ST:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minST === null ? "" : constraints.minST,
                                        onChange: (e) => handleConstraintChange("minST", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxST === null ? "" : constraints.maxST,
                                        onChange: (e) => handleConstraintChange("maxST", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "DE:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minDE === null ? "" : constraints.minDE,
                                        onChange: (e) => handleConstraintChange("minDE", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxDE === null ? "" : constraints.maxDE,
                                        onChange: (e) => handleConstraintChange("maxDE", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "CO:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minCO === null ? "" : constraints.minCO,
                                        onChange: (e) => handleConstraintChange("minCO", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxCO === null ? "" : constraints.maxCO,
                                        onChange: (e) => handleConstraintChange("maxCO", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "IN:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minIN === null ? "" : constraints.minIN,
                                        onChange: (e) => handleConstraintChange("minIN", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxIN === null ? "" : constraints.maxIN,
                                        onChange: (e) => handleConstraintChange("maxIN", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "WI:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minWI === null ? "" : constraints.minWI,
                                        onChange: (e) => handleConstraintChange("minWI", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxWI === null ? "" : constraints.maxWI,
                                        onChange: (e) => handleConstraintChange("maxWI", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "LK:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minLK === null ? "" : constraints.minLK,
                                        onChange: (e) => handleConstraintChange("minLK", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxLK === null ? "" : constraints.maxLK,
                                        onChange: (e) => handleConstraintChange("maxLK", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),
                            _jsxs("div", {
                                style: { display: "flex", alignItems: "center", gap: "4px", gridColumn: "1 / -1" },
                                children: [
                                    "CH:",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Min",
                                        value: constraints.minCH === null ? "" : constraints.minCH,
                                        onChange: (e) => handleConstraintChange("minCH", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    }),
                                    "-",
                                    _jsx("input", {
                                        type: "number",
                                        placeholder: "Max",
                                        value: constraints.maxCH === null ? "" : constraints.maxCH,
                                        onChange: (e) => handleConstraintChange("maxCH", e.target.value === "" ? null : parseInt(e.target.value)),
                                        style: { width: "50px", padding: "2px 4px", fontSize: "0.75rem", fontFamily: "Consolas, Courier New, monospace", border: "1px solid #ddd", borderRadius: "2px" }
                                    })
                                ]
                            }),
                        ]
                    })
                ]
            })
        ]
    });
};

export default FilterPanel;

