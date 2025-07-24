# Item Schema

This page documents the structure of `RoD_Item.txt` based on the original Delphi application source code. Each item entry is pipe (`|`) separated with **30** fields (31 fields in version 5.1 with RawID). The mapping below is definitive based on the original source code.

| Index | Original Name | Display Name | Description |
|------:|---------------|--------------|-------------|
| 0 | **OType** | Type | Item category such as `armor`, `weapon`, `container`, etc. |
| 1 | **Wear** | Wearloc | Where the item can be worn or `none` if not wearable. |
| 2 | **Name** | Name | Short name of the item. |
| 3 | **Lv** | Lv | Item level or level range. |
| 4 | **AC** | AC | Base armor class value. |
| 5 | **AcAdd** | -AC | AC modifier (negative values improve AC). |
| 6 | **D1** | d1 | Minimum damage value for weapons. |
| 7 | **D2** | d2 | Maximum damage value for weapons. |
| 8 | **HR** | HR | Hit roll bonus/penalty. |
| 9 | **DR** | DR | Damage roll bonus/penalty. |
|10 | **HP** | HP | Hit points bonus/penalty. |
|11 | **MP** | MP | Mana points bonus/penalty. |
|12 | **ST** | ST | Strength bonus/penalty. |
|13 | **DE** | DE | Dexterity bonus/penalty. |
|14 | **CO** | CO | Constitution bonus/penalty. |
|15 | **IN** | IN | Intelligence bonus/penalty. |
|16 | **WI** | WI | Wisdom bonus/penalty. |
|17 | **LK** | LK | Luck bonus/penalty. |
|18 | **CH** | CH | Charisma bonus/penalty. |
|19 | **MV** | MV | Movement points bonus/penalty. |
|20 | **Wgt** | Wgt | Item weight. |
|21 | **Value** | Value | Item value in gold pieces. |
|22 | **Flags** | Flags | Item properties like `magic`, `glow`, `noremove`. |
|23 | **Antis** | Antis | Alignment/class restrictions (e.g. `anti-Good`). |
|24 | **Races** | Races | Races allowed to use the item. |
|25 | **Other** | Other | Miscellaneous properties like resistances, saves, etc. |
|26 | **Mob** | Mob/Room | Mob name or location where item is found. |
|27 | **Area** | Area | Area or zone where the item is found. |
|28 | **Date** | Added | Date the record was added/updated. |
|29 | **User** | Edited | Who added or last edited the entry. |
|30 | **RawID** | RawID | Raw ID field (version 5.1 only, optional). |

## Field Details

### Column Indices (from original source)
```pascal
ColOType = 0;   ColWear = 1;    ColName = 2;    ColLv = 3;      ColAC = 4;
ColAcAdd = 5;   ColD1 = 6;      ColD2 = 7;      ColHR = 8;      ColDR = 9;
ColHP = 10;     ColMP = 11;     ColST = 12;     ColDE = 13;     ColCO = 14;
ColIN = 15;     ColWI = 16;     ColLK = 17;     ColCH = 18;     ColMV = 19;
ColWgt = 20;    ColValue = 21;  ColFlags = 22;  ColAntis = 23;  ColRaces = 24;
ColOther = 25;  ColMob = 26;    ColArea = 27;   ColDate = 28;   ColUser = 29;
ColRawID = 30;  // Optional in version 5.1
```

### Maximum Field Widths (from original source)
The original application defined maximum expected field widths for display purposes:
- **Name (2):** Up to 60+ characters (e.g., "black-bladed sword with an angel-winged hilt named 'Virtue'")
- **Other (25):** Up to 60 characters for miscellaneous properties
- **Mob/Room (26):** Up to 40+ characters for location information
- **Area (27):** Up to 35+ characters for area names
- **Flags (22):** Compact flag codes like "MTWCDL"
- **Antis (23):** Compact anti-flag codes like "MTWCDVRAGJTHY"
- **Races (24):** Compact race codes like "HGHRUSJE"

## Common Values

### Item Types (Column 0)
The **Type** column contains roughly sixty different values. Common ones include:
`armor`, `weapon`, `container`, `drinkcon`, `potion`, `food`, `scroll`, `boat`, `fetish`, etc.

### Wear Locations (Column 1)
Keywords such as `body`, `head`, `finger`, `hold`, `waist`, `light`, `neck`, `legs`, `feet`, `hands`, `arms`, `about`, `shield`, `wrist`, `wield`, `dual wield`, `ears`, `eyes`, `back`, `face`, `ankle`, etc. Items that cannot be worn use `none` or `*`.

### Flags (Column 22)
Special properties include: `magic`, `glow`, `dark`, `loyal`, `evil`, `invis`, `nodrop`, `bless`, `noremove`, `inventory`, `deathrot`, `groundrot`, `organic`, `metal`, `clan`, `prototype`, `enchanted`, `permanent`, `pkill`, `two-handed`, `layerable`, `not_in_game`, `gloried`, `noenchant`, `unique`.

### Anti Flags (Column 23)
Alignment/class restrictions: `anti-Good`, `anti-Evil`, `anti-Neutral`, `anti-Male`, `anti-Female`, `anti-Its`, `anti-Mage`, `anti-Thief`, `anti-Warrior`, `anti-Cleric`, `anti-Druid`, `anti-Vampire`, `anti-Ranger`, `anti-Paladin`, `anti-Fathomer`, `anti-Nephandi`, `anti-Augurer`, `anti-Bladesinger`, `anti-Barbarian`.

### Races (Column 24)
Available races: `Human`, `Dwarf`, `Elf`, `Halfling`, `Pixie`, `Half-Elf`, `Half-Ogre`, `Half-Orc`, `Half-Troll`, `Gith`, `Sea-Elf`, `Drow`, `Lizardman`, `Gnome`, `Dragonborn`, `Tiefling`.

### Other Properties (Column 25)
Miscellaneous tags including:
- **Saves:** `SvSp`, `SvBr`, `SvPo`, `SvPa`, `SvRo` (Spell, Breath, Poison, Paralysis, Rod)
- **Resistances:** `Res`, `Sus`, `Imm` (Resistance, Susceptibility, Immunity)
- **Effects:** `blind`, `invisible`, `detect_evil`, `detect_invis`, `detect_magic`, `detect_hidden`, `hold`, `sanctuary`, `faerie_fire`, `infrared`, `curse`, `_flaming`, `poison`, `protect`, `_paralysis`, `sneak`, `hide`, `sleep`, `charm`, `flying`, `pass_door`, `floating`, `truesight`, `detect_traps`, `scrying`, `fireshield`, `shockshield`, `iceshield`, `aqua_breath`, `contagious`, `acidmist`, `venomshield`
- **Regeneration:** `HP_Regen_`, `Mana_Regen_`
- **Modifiers:** `Carry_Cap_`, `Dam_of_`, `Cost_of_`, `Wait_of_`
- **Weapon Types:** `[slashing]`, `[piercing]`, `[bludgeoning]`, etc.
- **Resistances:** `ResCold_10%`, `ResAcid_25%`, etc.

## Example Entry

```
armor | waist | tattered sash | 27 | 4 |  |  |  |  |  |  |  |  |  |  |  |  |  |  | -10 | 1 | 8000 |  |  |  |  | Area Pop (Traveling the sands....) | Desert of Despair | 2024-05-27 | User - Add |
```

* **Type (0):** `armor`
* **Wearloc (1):** `waist`
* **Name (2):** `tattered sash`
* **Level (3):** `27`
* **AC (4):** `4`
* **AC Modifier (5):** empty
* **Movement (19):** `-10`
* **Weight (20):** `1`
* **Value (21):** `8000`
* **Mob/Room (26):** `Area Pop (Traveling the sands....)`
* **Area (27):** `Desert of Despair`
* **Date (28):** `2024-05-27`
* **Editor (29):** `User - Add`

Empty fields correspond to optional columns that were not recorded for this item.

## Version History

- **Version 5.0:** 30 fields (standard format)
- **Version 5.1:** 31 fields (added RawID field at index 30)

The current data file uses version 5.0 format with 30 fields per item.

