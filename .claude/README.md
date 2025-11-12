# Claude Context Files

This directory contains context files that help Claude quickly understand this project and provide better assistance.

## Files in this Directory

### 📘 project-context.md
**Purpose**: Comprehensive project overview for Claude

**Contains**:
- What this project is and its structure
- All learning phases (CRAWL, WALK, RUN, OPTIMIZE)
- Interview prep tracks (Sprint & Deep Dive)
- Where to find topics
- How Claude should help you
- Teaching philosophy and approach

**When to reference**: Claude should read this at the start of every session to understand the project.

---

### 📗 quick-commands.md
**Purpose**: Quick reference commands for users

**Contains**:
- Ready-to-use commands for starting study sessions
- Commands for each learning phase
- Mock interview commands
- Quiz and practice commands
- Example session flows

**When to reference**: Users should reference this when starting a new session or when they forget commands.

---

## How This Works

### For Users

When you start a new Claude session (new device, new CLI, etc.):

**Option 1: Simple Start**
```
"Hi Claude! I'm working on the e-commerce learning platform.
Let's start Sprint Day 1."
```

Claude will automatically have context from these files.

**Option 2: Reference Commands**
```
"Claude, check the quick-commands file and let's start."
```

**Option 3: Be Specific**
```
"Claude, I'm on Day 2 of the Interview Sprint. Let's continue
with the Next.js section."
```

### For Claude

When a user starts a session:
1. Reference `project-context.md` to understand the project
2. Check which phase/day/topic they want to work on
3. Navigate to the appropriate guide (INTERVIEW-SPRINT.md, etc.)
4. Begin interactive study session

---

## Common Scenarios

### Scenario 1: New Session, Continuing Previous Work
```
User: "Hi Claude! I'm back. I was working on Sprint Day 2 yesterday."

Claude should:
1. Check project-context.md
2. Open INTERVIEW-SPRINT.md
3. Navigate to Day 2
4. Ask what section they want to continue with
5. Begin interactive practice
```

### Scenario 2: User Needs Help Finding Something
```
User: "Where can I learn about Server Components?"

Claude should:
1. Reference project-context.md's "Key Topics" section
2. Identify: WALK phase, Sprint Day 2, Deep Dive Day 2
3. Offer to explain or practice that topic
```

### Scenario 3: Interview Tomorrow
```
User: "My interview is tomorrow! Quick review."

Claude should:
1. Reference the 30-min review checklist from INTERVIEW-SPRINT.md
2. Go through each section quickly
3. Focus on key talking points
4. Quiz on essential questions
```

---

## Updating These Files

If you add new content to the learning platform:

1. **Update project-context.md** with:
   - New phases or sections
   - New topics and where to find them
   - Changes to structure

2. **Update quick-commands.md** with:
   - New commands for accessing new content
   - Examples using new features

3. **Keep them synced** with:
   - CRAWL-WALK-RUN.md
   - INTERVIEW-SPRINT.md
   - INTERVIEW-DEEP-DIVE.md
   - docs/phases/*.md

---

## Benefits

### For Users
✅ Faster session starts (no explaining the project each time)
✅ Consistent experience across devices
✅ Quick command reference
✅ Claude understands your learning journey

### For Claude
✅ Immediate project context
✅ Clear guidance on how to help
✅ Knowledge of all available resources
✅ Understanding of user's learning approach

---

## File Maintenance

**When to update project-context.md**:
- Added new learning phase
- Created new documentation
- Changed project structure
- Added new topics

**When to update quick-commands.md**:
- Users frequently ask for something not listed
- New common patterns emerge
- Better ways to phrase commands discovered

---

**Last Updated**: Check git log for this directory
