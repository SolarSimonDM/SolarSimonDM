const groovytracks_array = [
    // general folder
    { file: "A_Ride_in_Roadway_Street.mp3", name: "A Ride in Roadway Street", duration: "2:28", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Airlectricity.mp3", name: "Airlectricity", duration: "1:01", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Cybermesh.mp3", name: "Cybermesh", duration: "1:00", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Disco_Garden.mp3", name: "Disco Garden", duration: "1:07", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Duper_Interiors.mp3", name: "Duper Interiors", duration: "1:14", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Fansynth_Pants_Adventure.mp3", name: "Fansynth Pants Adventure", duration: "1:36", groovytrack_folder: "general", artist: "SolarSimonDM" },    
    { file: "Grooves_is_on_the_Case.mp3", name: "Grooves is on the Case", duration: "1:08", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "HardCORE.mp3", name: "HardCORE", duration: "1:08", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Harpbass.mp3", name: "Harpbass", duration: "2:23", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "hollow_knight_inspired_melody_whatchamacalit.mp3", name: "hollow-knight-inspired melody whatchamacalit", duration: "1:31", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "If_Cyman_directed_an_action_blockbuster.mp3", name: "If Cyman directed an action blockbuster", duration: "2:26", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Its_Sprint_Time.mp3", name: "It's Sprint Time!", duration: "1:34", image: "thumb_Its_Sprint_Time.png", groovytrack_folder: "general", artist: "SolarSimonDM" },    
    { file: "Maniac_Machinations.mp3", name: "Maniac Machinations", duration: "2:50", image: "thumb_Maniac_Machinations.png", groovytrack_folder: "general", artist: "SolarSimonDM" },    
    { file: "Maniac_Miscalculations.mp3", name: "Maniac Miscalculations", duration: "1:02", groovytrack_folder: "general", artist: "SolarSimonDM" }, 
    { file: "Metal_Cowboys.mp3", name: "Metal Cowboys", duration: "1:03", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Party_on_Andromeda.mp3", name: "Party on Andromeda", duration: "1:08", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Rap_Cats_Downtown.mp3", name: "Rap Cats Downtown", duration: "1:10", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Recalibrate_Cymans_Theme.mp3", name: "Recalibrate - Cyman's Theme", duration: "1:53", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Rowmans_Shanty.mp3", name: "Rowman's Shanty", duration: "1:02", groovytrack_folder: "general", artist: "SolarSimonDM" }, 
    { file: "Ta_Ren_Theme_2_0.mp3", name: "Tá Ren Theme 2.0", duration: "0:50", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "This_Is_Not_Your_Battlefield.mp3", name: "This Is Not Your Battlefield", duration: "3:00", image: "thumb_This_Is_Not_Your_Battlefield.png", groovytrack_folder: "general", artist: "SolarSimonDM" },    
    { file: "Town_Lost_in_Myth.mp3", name: "Town Lost in Myth", duration: "3:48", groovytrack_folder: "general", artist: "SolarSimonDM" },
    { file: "Zenith.mp3", name: "Zenith", duration: "2:50", groovytrack_folder: "general", artist: "SolarSimonDM" },

    // TSTV OST
    { file: "TSTV/TSTV_OST_Archiebald_I_Choose_You_Badger_Approaching.mp3", name: "T.S.T.V. OST - Archiebald I Choose You - Badger Approaching", duration: "0:47", groovytrack_folder: "TSTV", artist: "SolarSimonDM" },
    { file: "TSTV/TSTV_OST_Level_1_The_Cemetery.mp3", name: "T.S.T.V. OST - Level 1 - The Cemetery", duration: "1:20", groovytrack_folder: "TSTV", artist: "SolarSimonDM" },
    { file: "TSTV/TSTV_OST_In_Grave_Danger_Cemetery_Fight.mp3", name: "T.S.T.V. OST - In Grave Danger - Cemetery Fight", duration: "1:15", groovytrack_folder: "TSTV", artist: "SolarSimonDM" },    
    { file: "TSTV/TSTV_OST_Level_2_Creaturopolis.mp3", name: "T.S.T.V. OST - Level 2 - Creaturopolis", duration: "2:03", groovytrack_folder: "TSTV", artist: ["SolarSimonDM", "Od. G."] },
    { file: "TSTV/TSTV_OST_Beast_Street_Beat_Creaturopolis_Fight.mp3", name: "T.S.T.V. OST - Beast Street Beat - Creaturopolis Fight", duration: "1:33", groovytrack_folder: "TSTV", artist: "SolarSimonDM" },    
    { file: "TSTV/TSTV_OST_Level_3_Groove_City.mp3", name: "T.S.T.V. OST - Level 3 - Groove City", duration: "1:22", groovytrack_folder: "TSTV", artist: ["SolarSimonDM", "Od. G."] },
    { file: "TSTV/TSTV_OST_Waltz_of_the_Frogs.mp3", name: "T.S.T.V. OST - Waltz of the Frogs", duration: "1:12", groovytrack_folder: "TSTV", artist: ["SolarSimonDM", "Od. G."] },
    { file: "TSTV/TSTV_OST_Ze_Shaman_Awwives.mp3", name: "T.S.T.V. OST - Ze Shaman Awwives", duration: "0:55", groovytrack_folder: "TSTV", artist: ["SolarSimonDM", "Od. G."] },

    // SCARR
    { file: "SCARR/Archie_Theme_Orchestra.mp3", name: "Archie Theme (Orchestra)", duration: "0:56", groovytrack_folder: "SCARR", artist: "Od. G." },
    { file: "SCARR/Robs_Theme_Bayand_Practoice.mp3", name: "Rob's Theme Bayand Practoice", duration: "0:44", groovytrack_folder: "SCARR", artist: "SolarSimonDM" },
];