# MASTER TECHNICAL EDUCATION & CAREER ROADMAP
## Software Engineering → ML Engineering → AI/ML Engineering
### 2026 onward | Extreme-detail personal source-of-truth roadmap

> **North star:** Build the depth to understand, design, implement, deploy, scale, debug, evaluate, and improve intelligent software systems from first principles through production.
>
> **Primary trajectory:** Software Engineering → ML Engineering → AI/ML Engineering
>
> **Parallel competency:** Data Science / Data Analytics
>
> **Long-term ambition:** Be competitive for demanding software, ML, AI, research-engineering, and applied-science opportunities at elite technology companies while preserving the option of advanced research and postgraduate study.

> **Revision note (2026-09-17 FINAL):** This edition is the active source of truth. It keeps the full long-term map, but adds a resource architecture, explicit resource coverage by phase, a beginner-to-documentation progression, day-one launch instructions, sharper gates, cleaner phase numbering, feedback/exposure loops, AI-assisted-learning rules, and resource maintenance rules. Execution still starts from complete practical scratch.

---

# 0. HOW TO USE THIS ROADMAP

This document is deliberately enormous. It is the **master curriculum and long-term source of truth**, not a list to attack all at once.

The master roadmap answers:

> **What could I eventually need to learn?**

The execution layer answers:

> **What exactly am I doing now?**

Never confuse the two.

## 0.1 BASELINE RESET: STARTING FROM COMPLETE PRACTICAL SCRATCH

For execution purposes, this roadmap assumes **zero practical programming fluency**.

Previous exposure, coursework, library usage, or project history does not count as mastery until the capability can be demonstrated independently.

> **Assume nothing. Rebuild the foundation. Prove each capability. Then move forward.**

Before leaving the initial programming reset, you should be able to write from memory and explain:

- variables and expressions
- `if / elif / else`
- `for` loops
- `while` loops
- functions and `return`
- lists, tuples, sets, dictionaries
- string operations
- simple input/output
- basic exception handling
- reading and writing simple files

If these still require a tutorial for ordinary use, **do not move on because the calendar says it is time**.

## 0.2 THE CARDINAL RULE

Do not try to learn the whole roadmap simultaneously.

At any given time, the execution layer should contain:

- **ONE primary learning block**
- **At most ONE supporting block** when capacity allows
- **A small maintenance track** only after the relevant foundation exists
- **ONE active project** only when academic load permits

During the true beginner reset, there may be **only one real learning block: programming**.

Everything else is reference material until the current gate is passed.

## 0.3 ACTIVE-PATH MODES

### Mode A - Foundation Reset

Primary: programming fundamentals.

Supporting: environment setup and Git only as needed to support programming.

Not active: ML, deep learning, cloud, Kubernetes, advanced DSA, LLM engineering.

### Mode B - Normal Semester

Primary: university obligations plus one roadmap module.

Supporting: one small secondary block if there is real capacity.

Maintenance: DSA after the programming gate.

Project: one active project milestone.

### Mode C - Heavy Semester

Use this mode for roughly 10 or more substantial courses, multiple high-workload quantitative/programming courses, a major internship/SIWES workload, or repeated weeks where university work consumes most available study time.

Then use university as the priority. Keep only maintenance work outside school. The roadmap can pause.

A roadmap pause is **not failure**. It is correct scheduling.

### Mode D - Examination Period

University preparation is primary. Pause new roadmap modules. DSA may be an optional 15-30 minute maintenance session only if it helps rather than distracts.

### Mode E - Internship / SIWES

Treat genuine overlapping work as applied learning. Do not attempt to run the entire independent curriculum alongside a demanding placement.

### Mode F - Long Break / Low Academic Load

Use extra capacity for deeper study, projects, DSA, deployment practice, and research reproduction while keeping the active path narrow.

## 0.4 EXECUTION STATES

Use:

- **NOW** - current focus
- **NEXT** - next dependency-respecting block
- **LATER** - important, but prerequisites are not ready
- **OPTIONAL** - valuable for a specialization, but not universally necessary
- **DEFER** - deliberately postponed to protect the core
- **MAINTENANCE** - previously learned material being retained

## 0.5 EVIDENCE OF LEARNING

A topic is not complete because you watched a video.

Default loop:

1. Learn.
2. Explain without notes.
3. Reason through the mechanism where appropriate.
4. Implement a small version where educationally useful.
5. Solve targeted exercises/problems.
6. Use the mature library or real tool.
7. Build something with it.
8. Break or debug something involving it.
9. Document what you learned.
10. Re-test it later.

## 0.6 THE ANTI-TUTORIAL-HELL RULE

Prefer:

**learn -> attempt -> get stuck -> consult -> fix -> explain**

over:

**watch -> watch -> watch -> watch -> maybe code later.**

## 0.7 RESOURCE PROGRESSION RULE

Resources are deliberately staged. The objective is not to use the most advanced resource as early as possible. The objective is to move from **guided learning to independent technical work**.

### Resource levels

- **R0 - Orientation:** roadmap pages, overviews, terminology maps.
- **R1 - Beginner primary:** a structured course, textbook, or guided curriculum that teaches the subject in sequence.
- **R2 - Practice:** exercises, problem sets, coding challenges, labs, or notebooks.
- **R3 - Official reference:** language, framework, library, protocol, or platform documentation.
- **R4 - Deep reference:** university notes, advanced textbooks, architecture material, source-oriented explanations.
- **R5 - Primary sources:** specifications, standards, research papers, source code, benchmarks, design documents.
- **R6 - Real system:** production projects, incident reports, performance investigations, open-source contributions, and original experiments.

### Default progression

```text
R0 orientation
     ↓
R1 structured learning
     ↓
R2 deliberate practice
     ↓
R3 official documentation becomes normal
     ↓
R4 deep technical references
     ↓
R5 specifications / source / papers
     ↓
R6 real systems and original work
```

At beginner level, a good course can save enormous time and prevent false confidence. Do not avoid excellent beginner material merely because it is beginner material. Later, as your competence increases, **documentation should gradually become the default place you learn exact behavior**.

### The resource stack for a major subject

Use one active stack:

1. **Primary:** the resource you actually follow.
2. **Practice:** where you prove the concept.
3. **Official reference:** the authoritative place you check exact behavior.
4. **Deepening:** one serious source for deeper understanding.
5. **Implementation:** a concrete artifact that forces integration.

Do not create a primary-resource pile.

### What “best resource” means here

There is no timeless universal best resource on the internet. A resource is selected because it is a strong fit for **your current level, desired depth, subject stability, learning objective, practice needs, and eventual engineering use**. When a subject is broad, multiple complementary resources are intentional rather than redundant.

## 0.8 THE ANTI-FRAMEWORK-HOPPING RULE

A new framework is not automatically a new learning priority. Learn concepts deeply, then learn frameworks as implementations of those concepts.

## 0.9 PHASE-GATING RULE

A later phase is unlocked by **capability evidence**, not calendar time.

For each phase:

- identify 5-10 must-know capabilities
- practise them without constant tutorial dependence
- produce at least one artifact
- pass a practical mastery check
- re-test later

Optional topics never block a core phase unless they become relevant to the chosen specialization.

## 0.10 SPACED-RETEST RULE

For major foundational capabilities, use this default review rhythm:

```text
Initial mastery
    ↓
1-3 days
    ↓
7 days
    ↓
30 days
    ↓
90 days
    ↓
6 months
```

The re-test should be active recall or a small unseen problem, not rereading notes. If a foundational skill repeatedly fails re-testing, temporarily bring it back into NOW.

## 0.11 TIME-CAPACITY RULE

Do not invent a workload your semester cannot support. Rough external-roadmap ceilings after university obligations:

- **0-5 hours/week:** one primary block only
- **5-10 hours/week:** one primary block + DSA maintenance after the programming gate
- **10-15 hours/week:** primary + DSA + one modest project milestone
- **15+ hours/week:** mainly for long breaks or unusually light periods

These are planning ranges, not quotas.

## 0.12 START HERE - YOUR REAL DAY ONE

The entire roadmap is built around a single principle: **you do not need to understand the whole roadmap before starting it.**

### Day 1 active path

**NOW:** Python fundamentals only.

**Supporting setup:** VS Code or another editor, Python, terminal, and one Git repository if setup is trivial. Do not turn setup into a separate course.

**Do not activate yet:** DSA, SQL, pandas, machine learning, deep learning, cloud, Kubernetes, LLM engineering, advanced Java, advanced JavaScript, or system design.

### Day 1 resource stack

- **Primary:** Harvard CS50P - Introduction to Programming with Python
  https://cs50.harvard.edu/python/
- **Practice:** the exercises and your own tiny programs; optionally Exercism Python once you begin needing extra repetition
  https://exercism.org/tracks/python
- **Official reference:** Python documentation
  https://docs.python.org/3/
- **Later deep reference:** Python language/reference documentation and implementation material when the corresponding concepts become relevant

### Day 1 work

1. Create a folder for the roadmap and a Git repository.
2. Verify that Python runs from your terminal.
3. Complete the first CS50P learning block on functions, variables, expressions, and input/output.
4. Write small programs **without copying the solution**. Start with:
   - greeting a user
   - converting one unit to another
   - calculating a total cost
   - deciding whether a number is even or odd
   - a tiny age or score classifier
5. Break one program deliberately, observe the error, and fix it.
6. Close the material and explain what each line of your final program does.
7. Record exactly what still feels weak.

### Day 1 completion condition

Do not ask, “Did I finish the lesson?” Ask:

> **Can I write a small Python program using the concepts I learned without the video open?**

A partial “no” is useful information. Repeat the smallest weak concept instead of jumping ahead.

### First 14 days

```text
Days 1-3   Functions, variables, expressions, input/output
Days 4-6   Conditionals and boolean reasoning
Days 7-9   Loops and iteration
Days 10-11 Strings and collections
Days 12-13 Functions, decomposition, small programs
Day 14     Exceptions, files, review, unseen test
```

This is not a promise that the foundation will be complete in 14 days. It is the **first review horizon**. Spend longer when the skill is not real yet.

### The first gate

You leave the beginner runway only when you can independently write and explain the core Python capabilities listed in Phase 1, complete small unseen tasks, and debug ordinary mistakes.

**The rest of this document is the map. Your active path should contain only a small slice of it.**

# 1. NORTH STAR: THE ENGINEER YOU ARE BUILDING

The target is not a collection of job titles.

The target is a technical profile that can move across layers.

```text
Problem
  ↓
Requirements
  ↓
Data
  ↓
Mathematical formulation
  ↓
Algorithm
  ↓
Model
  ↓
Software implementation
  ↓
API / service
  ↓
Infrastructure
  ↓
Deployment
  ↓
Monitoring
  ↓
Evaluation
  ↓
Iteration
```

## 1.1 Capabilities the final profile should have

You should eventually be able to:

- decide whether a problem needs ML at all
- translate vague requirements into technical requirements
- reason about computational complexity
- choose appropriate data structures
- design relational schemas
- write strong SQL
- understand operating-system behavior
- understand networking sufficiently to debug real systems
- design backend APIs
- build maintainable software
- write tests
- diagnose bugs
- build data pipelines
- perform serious exploratory analysis
- formulate statistical hypotheses
- select appropriate ML models
- explain model assumptions and failure modes
- implement selected algorithms from scratch
- train deep neural networks
- explain backpropagation
- understand attention and Transformers
- build LLM applications
- evaluate RAG and agent systems
- package and serve models
- build training/inference pipelines
- deploy systems
- monitor them
- reason about latency, throughput, reliability, cost, and scaling
- read technical papers
- reproduce experimental results
- communicate technical decisions
- perform strongly in coding and system-design interviews

---

# 2. MASTER ARCHITECTURE

```text
FOUNDATIONS
├── Programming
├── Git/GitHub
├── Linux/CLI
├── Mathematics
└── Study/Problem-Solving Discipline
        │
        ├─────────────────────────────┐
        ↓                             ↓
COMPUTER SCIENCE                    DATA
├── DSA                             ├── SQL
├── Operating Systems               ├── NumPy/Pandas
├── Networking                      ├── EDA
├── Computer Architecture           ├── Statistics
├── Databases                       └── Data Engineering
└── Distributed Systems
        │                             │
        └──────────────┬──────────────┘
                       ↓
                SOFTWARE ENGINEERING
                ├── Design
                ├── Testing
                ├── Debugging
                ├── Backend
                ├── APIs
                ├── Architecture
                └── Security
                       │
                       ↓
                  SYSTEM DESIGN
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
       CLASSICAL ML         PRODUCTION ENGINEERING
             │               ├── Docker
             ↓               ├── CI/CD
      DEEP LEARNING          ├── Cloud
             │               ├── IaC
             ↓               └── Kubernetes
       ML ENGINEERING
             │
             ↓
           MLOps
             │
      ┌──────┴─────────┐
      ↓                ↓
AI ENGINEERING     ML SYSTEMS
├── LLMs           ├── Recommenders
├── RAG            ├── Search
├── Agents         ├── Fraud
├── Multimodal     ├── Serving
└── Evaluation     └── Infrastructure
      │                │
      └──────┬─────────┘
             ↓
     RESEARCH / SPECIALISATION

CONTINUOUS PARALLEL TRACKS
├── DSA / Interview Preparation
├── Projects
├── GitHub / Open Source
├── Technical Writing
├── Research
├── Internships
├── Portfolio
└── Career Strategy
```

---

# 3. DEPTH MODEL

Use six levels.

## D0 - Awareness

You can define it, explain why it exists, and identify where it appears.

## D1 - Basic

You can use it with documentation and guidance.

## D2 - Working

You can independently use it in normal projects.

## D3 - Professional

You understand common trade-offs, failure modes, testing, operational concerns, and real usage.

## D4 - Advanced

You understand internals, optimisation, architecture, edge cases, and design trade-offs.

## D5 - Research / Specialist

You can engage with primary literature, reproduce results, design experiments, and potentially contribute new work.

### Important

D4 does not mean you must know every obscure detail.

D5 should not be pursued simply because D5 exists.

Depth should match the role and the problem.

---

# 4. PRIORITY MODEL

## 🔴 CRITICAL

Core to the long-term trajectory or repeatedly useful across roles.

## 🟠 HIGH

Important for professional work, internships, production systems, or advanced specialization.

## 🟡 USEFUL

Valuable, but should not displace core foundations.

## 🟢 OPTIONAL

Relevant mainly to a specialization or particular role.

## ⚪ DEFER / SKIP UNLESS NEEDED

Do not spend serious time here until a concrete need appears.

---

# 5. LEARNING METHOD: HOW TO TURN TOPICS INTO SKILLS

## 5.1 The six-pass method

### Pass 1 - Orientation

Know:

- what the topic is
- why it exists
- what problem it solves
- where it appears
- its vocabulary

### Pass 2 - Mechanism

Understand:

- how it works
- what assumptions it makes
- what inputs it expects
- what outputs it produces
- where it can fail

### Pass 3 - Implementation

Implement the simplest meaningful version yourself when useful.

### Pass 4 - Practice

Solve exercises or small tasks designed to expose weaknesses.

### Pass 5 - Production usage

Use the mature library/tool and learn its practical conventions.

### Pass 6 - Integration

Build something that forces the topic to interact with previous knowledge.

## 5.2 The Feynman test

You should be able to answer:

- What is it?
- Why does it exist?
- How does it work?
- Why does the standard approach look the way it does?
- What can go wrong?
- When would I choose something else?

## 5.3 PHASE COMPLETION STANDARD

A phase is not complete because the topic list has been read. For every phase, define:

### Must know

Five to ten capabilities that cannot be skipped.

### Must build

At least one small artifact that demonstrates the capability.

### Must explain

You can explain the central mechanisms without reading notes.

### Must perform

You can complete an unseen exercise or practical task with limited documentation.

### Must debug

You can diagnose at least one realistic failure.

### Must retain

The capability survives a later spaced re-test.

If a phase is failing these checks, reduce breadth and repair the weakness.

## 5.4 MASTERY IS PERFORMANCE, NOT EXPOSURE

Use this evidence hierarchy:

```text
heard about it
    <
can follow a tutorial
    <
can use documentation
    <
can use independently
    <
can explain
    <
can debug
    <
can design with it
    <
can compare alternatives / teach it
```

# 6. PHASE 1 - PROGRAMMING FOUNDATIONS

# 6.1 Python - 🔴 long-term D4 | Entry target: D2

**Role:** primary language for data, ML, AI, scripting, automation, research, and potentially backend work.

## Zero-level runway - do not skip

Start here if loops, conditions, functions, and basic collections are not reliable from memory.

### Module A - First contact

- `print()`
- variables and assignment
- strings, integers, floats, booleans
- arithmetic and comparisons
- expressions and operator precedence

### Module B - Control flow

Write small programs from memory using:

- `if`
- `elif`
- `else`
- `for`
- `while`
- `range()`
- `break`
- `continue`

### Module C - Functions

- defining functions
- parameters and arguments
- return values
- local vs global scope
- small helper functions

### Module D - Core data structures

- lists
- tuples
- dictionaries
- sets
- strings
- indexing and slicing
- mutation vs reassignment
- nested structures

### Module E - Files, errors, and small programs

- input/output
- text files
- JSON/CSV at a basic level
- exceptions
- simple command-line programs

### Programming foundation gate

Before moving into DSA-heavy work, you should be able to complete these without a tutorial:

1. Write a `for` loop over a list and transform its values.
2. Write a `while` loop with a clear termination condition.
3. Write a function that validates input.
4. Count frequencies with a dictionary.
5. Filter data with a loop and a condition.
6. Read a text file and summarise its contents.
7. Handle an expected exception cleanly.
8. Build a small program of roughly 100-200 lines without copying a walkthrough.

The requirement is independent execution, not speed.

## Core language

Learn thoroughly:

- literals
- variables
- expressions
- operators
- control flow
- conditional statements
- loops
- pattern matching where relevant
- functions
- return values
- arguments
- positional and keyword arguments
- default arguments
- scopes
- namespaces
- imports
- modules
- packages
- exceptions
- file I/O
- strings
- bytes
- lists
- tuples
- sets
- dictionaries
- comprehensions

## Intermediate Python

- iterators
- generators
- generator expressions
- decorators
- closures
- higher-order functions
- context managers
- `with`
- dataclasses
- enums
- properties
- descriptors at awareness level
- protocols
- abstract base classes
- type annotations
- `typing`
- generics
- structural typing concepts

## Professional Python

- virtual environments
- dependency management
- package installation
- packaging
- `pyproject.toml`
- test discovery
- logging
- configuration management
- CLI design
- environment variables
- secrets handling
- linting
- formatting
- static type checking
- profiling
- debugging

## Deeper internals

Learn conceptually:

- object model
- references
- identity vs equality
- mutability
- memory allocation concepts
- reference counting
- garbage collection
- import machinery
- bytecode/interpreter concepts
- C extensions awareness
- concurrency models
- threads
- processes
- async event loops
- current Python concurrency evolution

## Required implementations

Build progressively:

1. CLI calculator
2. File organiser
3. Expense tracker
4. Log analyser
5. CSV/JSON processor
6. API client
7. CLI data-analysis tool
8. reusable Python package
9. tested backend service
10. small ML package

## Mastery

You should be able to start a medium-sized Python project without a tutorial, organise it sensibly, test it, debug it, document it, package it, and explain your design choices.

## Resources

### Primary - true beginner path

**CS50's Introduction to Programming with Python (CS50P)**
https://cs50.harvard.edu/python/

Use this as the main guided course for the initial reset.

### Secondary - broader CS context

**CS50x - Introduction to Computer Science**
https://cs50.harvard.edu/x/

Use later, not concurrently as a second full-time course, to deepen C, memory, algorithms, abstraction, and general CS.

### Official reference

**Python documentation**
https://docs.python.org/3/

Use the official docs as the reference source rather than the first teaching resource for an absolute beginner.

### Later reference

*Fluent Python* once basic fluency is established.

---

# 6.2 Java - 🟠 D2

Java is a supporting language here. It reinforces object-oriented design and a second strongly typed ecosystem, but Python remains the primary language for the main trajectory.

Learn:

- syntax
- primitives/reference types
- classes
- objects
- constructors
- inheritance
- interfaces
- abstraction
- polymorphism
- composition
- packages
- exceptions
- collections
- generics
- streams
- lambdas
- functional interfaces
- records
- concurrency basics
- threads
- executors
- synchronization concepts
- JVM basics
- memory model awareness
- Maven/Gradle
- JUnit

Use Java for:

- OOP mastery
- DSA implementations
- selected backend work
- understanding enterprise systems

Do not build a second enormous career roadmap around Java unless your opportunities demand it.

---

# 6.3 JavaScript / TypeScript - 🟡 D2

Purpose: understand the modern web well enough to build products and collaborate with frontend engineers.

Learn:

- variables
- functions
- objects
- arrays
- modules
- scope
- closures
- promises
- async/await
- event loop concepts
- HTTP requests
- JSON
- browser basics
- DOM awareness
- TypeScript types
- interfaces
- generics at basic level
- API consumption
- basic React

Do not turn frontend into the centre of the roadmap.

---

# 7. PHASE 2 - GIT, GITHUB, DEVELOPMENT ENVIRONMENT

# 7.1 Git - 🔴 D3

Learn:

- repository structure
- working tree
- staging
- commits
- branches
- merge
- rebase
- remote repositories
- fetch
- pull
- push
- tags
- release points
- history inspection
- reverting
- resetting
- conflict resolution
- cherry-picking awareness
- stash
- bisect awareness

Practice recovery:

- accidentally delete a file
- create a bad commit
- make a merge conflict
- recover an earlier version

You should not fear Git internals.

# 7.2 GitHub - 🔴 D3

Learn:

- repositories
- issues
- pull requests
- reviews
- project boards
- branch protection concepts
- Actions basics
- releases
- README writing
- repository organisation
- `.gitignore`
- secrets
- contribution workflows

## Mastery

You can collaborate in a real repository without treating Git as a mysterious sequence of incantations.

---

# 8. PHASE 3 - LINUX / CLI

# 8.1 Linux - 🔴 D3

Learn:

- filesystem hierarchy
- paths
- absolute vs relative paths
- permissions
- users
- groups
- processes
- environment variables
- standard input/output/error
- pipes
- redirection
- shell expansion
- shell scripts
- package managers
- process inspection
- logs
- system resource inspection
- networking commands
- SSH
- file transfer
- cron awareness

Core tools to become comfortable with:

- `pwd`
- `ls`
- `cd`
- `cp`
- `mv`
- `rm`
- `mkdir`
- `cat`
- `less`
- `head`
- `tail`
- `grep`
- `find`
- `sed`
- `awk`
- `sort`
- `uniq`
- `wc`
- `xargs`
- `curl`
- `wget`
- `ssh`
- `ps`
- `top`/`htop`
- `kill`
- `chmod`
- `chown`

## Projects

- shell backup script
- log-processing script
- local monitoring script
- deployment script
- automated data-ingestion script

---

# 9. PHASE 4 - DATA STRUCTURES & ALGORITHMS

**Entry condition:** pass the programming foundation gate. DSA is not the first topic in this zero-reset plan.

# Priority: 🔴 | Target: D4

This serves two purposes:

1. genuine computational thinking
2. demanding technical interviews

## 9.1 Complexity

Master:

- Big O
- Big Theta
- Big Omega
- worst-case analysis
- average-case reasoning
- amortised analysis
- time complexity
- space complexity
- trade-offs

Do not only memorise complexity tables. Derive them from loops and operations.

## 9.2 Linear structures

Learn and implement:

- arrays
- dynamic arrays
- strings
- linked lists
- singly linked lists
- doubly linked lists
- stacks
- queues
- deques
- hash tables
- sets

Understand:

- memory trade-offs
- access cost
- insertion/deletion cost
- locality
- collision handling

## 9.3 Trees

- binary trees
- BSTs
- traversal
- inorder
- preorder
- postorder
- level-order
- recursion
- balanced-tree concepts
- heaps
- priority queues
- tries

## 9.4 Graphs

- directed graphs
- undirected graphs
- weighted graphs
- adjacency lists
- adjacency matrices
- BFS
- DFS
- connected components
- cycle detection
- topological sorting
- shortest path
- Dijkstra
- Bellman-Ford awareness
- union-find
- minimum spanning tree awareness

## 9.5 Algorithm families

- linear search
- binary search
- sorting
- merge sort
- quicksort
- heap sort awareness
- recursion
- divide and conquer
- backtracking
- greedy algorithms
- dynamic programming
- graph algorithms
- bit manipulation

## 9.6 Problem-solving patterns

Become comfortable recognising:

- two pointers
- sliding window
- prefix sums
- hashing
- monotonic stack
- binary search on answer
- intervals
- fast/slow pointers
- tree DFS/BFS
- graph traversal
- topological ordering
- heap-based selection
- backtracking
- memoisation
- tabulation
- state compression awareness

## 9.7 Interview progression

```text
Learn pattern
↓
Implement pattern
↓
Easy problems
↓
Medium problems
↓
Selected hard problems
↓
Explain alternative solutions
↓
Timed solution
↓
Mock interview
```

The goal is pattern mastery, correctness, complexity reasoning, and communication rather than arbitrary problem counts.

### Planning benchmark

A long-term range of roughly 200–300 carefully understood problems can be useful as a planning guide, but it is not a qualification threshold.

## Resources

### Primary curriculum

**MIT 6.006 - Introduction to Algorithms**
https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/

Use the lectures, notes, problem sets, and solutions as the conceptual spine.

### Practice companion

**NeetCode**
https://neetcode.io/

Use for pattern-based and interview-oriented practice after learning the underlying concepts.

### Interview practice

**LeetCode**
https://leetcode.com/

Use selectively for timed and interview-style practice. Do not optimise for raw problem count.

### Local reinforcement

- university problem sets
- handwritten derivations
- your own implementations

---

# 10. PHASE 5 - CORE COMPUTER SCIENCE

# 10.1 Operating Systems - 🔴 D3

Learn:

- kernel vs user space
- processes
- threads
- context switching
- scheduling
- system calls
- virtual memory
- paging
- page faults
- filesystems
- file descriptors
- IPC
- pipes
- sockets awareness
- synchronization
- mutexes
- semaphores
- race conditions
- deadlocks
- memory allocation concepts
- caching
- CPU scheduling concepts

Key question:

> What actually happens between the moment I run a program and the moment it produces output?

Project ideas:

- process monitor
- shell
- simple scheduler simulation
- file-system exploration tool

## 10.2 Networking - 🔴 D3

Learn:

- packets
- frames awareness
- addressing
- IP
- routing concepts
- TCP
- UDP
- ports
- sockets
- DNS
- HTTP
- HTTPS
- TLS
- certificates awareness
- cookies
- sessions
- proxies
- reverse proxies
- load balancing
- WebSockets

Be able to explain:

```text
Browser
→ DNS
→ TCP
→ TLS
→ HTTP
→ reverse proxy
→ application
→ database
```

Practice with:

- `curl`
- browser devtools
- simple socket programs
- local HTTP servers

## 10.3 Computer Architecture - 🟠 D2–D3

Learn:

- CPU
- registers
- instructions
- ALU
- control flow
- cache
- RAM
- storage
- memory hierarchy
- binary
- hexadecimal
- integer representation
- floating-point awareness
- hardware threads
- compilation vs interpretation

Understand why:

- caches exist
- memory access costs differ
- data structures affect locality
- compiled code can outperform interpreted code in appropriate workloads

## 10.4 Compilers and runtimes - 🟡 D2

Learn conceptually:

- lexing
- parsing
- ASTs
- semantic analysis
- bytecode
- virtual machines
- interpreters
- compilers
- optimisation awareness
- runtime systems

Build a tiny interpreter eventually if the subject interests you or if you want deeper CS foundations.

---

# 11. PHASE 6 - DATABASES

# 11.1 Relational fundamentals - 🔴 D4

Learn:

- relational model
- tables
- rows
- columns
- schemas
- primary keys
- foreign keys
- constraints
- relationships
- one-to-one
- one-to-many
- many-to-many

## SQL mastery

- SELECT
- WHERE
- ORDER BY
- GROUP BY
- HAVING
- aggregate functions
- joins
- subqueries
- CTEs
- recursive CTE awareness
- window functions
- CASE
- string functions
- date/time handling
- NULL semantics
- views
- materialised-view awareness

## Database design

- normalisation
- functional dependencies
- normal forms
- denormalisation
- schema evolution
- migration strategy

## Transactions

- ACID
- atomicity
- consistency
- isolation
- durability
- transaction boundaries
- isolation levels
- locks
- deadlocks
- race conditions

## Performance

- indexes
- composite indexes
- covering indexes
- query planning
- EXPLAIN
- execution plans
- sequential scans
- index scans
- cardinality
- statistics
- query optimisation

## Distributed concepts

- replication
- read replicas
- partitioning
- sharding
- consistency
- availability
- CAP reasoning
- eventual consistency

# 11.2 PostgreSQL - 🔴 D4

Use PostgreSQL as the primary relational database for practical work.

Projects:

1. SQL analytics exercises.
2. Schema design for an application.
3. Transaction-heavy application.
4. Query optimisation exercise.
5. PostgreSQL-backed API.

## Resources

PostgreSQL official documentation and tutorial:
https://www.postgresql.org/docs/current/tutorial.html

# 11.3 Redis - 🟠 D2–D3

Learn:

- key-value model
- TTL
- caching
- session storage
- rate limiting
- simple queues
- pub/sub awareness

Do not use Redis merely because a project looks more sophisticated with Redis.

Know why the cache exists.

# 11.4 NoSQL - 🟡 D1–D2

Understand categories:

- document stores
- key-value stores
- wide-column databases
- graph databases

Study specific products only when the project or job requires them.

---

# 12. PHASE 7 - SOFTWARE ENGINEERING

# Target: 🔴 D4

## 12.1 Code quality

Learn:

- readability
- naming
- cohesion
- coupling
- modularity
- abstraction
- interfaces
- composition
- refactoring
- error handling
- defensive programming where appropriate

## 12.2 Principles

Learn:

- SOLID
- DRY
- KISS
- YAGNI

Do not turn principles into dogma.

Understand when an abstraction is useful and when it is overengineering.

## 12.3 Testing

Learn:

- unit tests
- integration tests
- end-to-end tests
- test doubles
- mocks
- stubs
- fixtures
- contract testing
- property-based testing awareness
- regression tests
- test coverage interpretation

## 12.4 Debugging

Become comfortable with:

- reproducing failures
- forming hypotheses
- isolating causes
- stack traces
- logs
- debuggers
- breakpoints
- assertions
- minimal reproduction cases
- regression testing

## 12.5 Engineering workflow

- issues
- pull requests
- code review
- branch strategy
- release process
- changelogs
- semantic versioning
- documentation
- architecture decision records awareness

---

# 13. PHASE 8 - BACKEND ENGINEERING

# Target: 🔴 D3–D4

Primary practical direction:

**Python + FastAPI**

Secondary ecosystem:

**Java + Spring Boot**

## 13.1 HTTP

Understand:

- request/response
- methods
- status codes
- headers
- content types
- cookies
- caching headers
- idempotency
- retries
- timeouts

## 13.2 REST

Learn:

- resources
- resource naming
- verbs
- representation
- pagination
- filtering
- sorting
- versioning
- error conventions
- idempotency

## 13.3 API design

- schema validation
- OpenAPI
- documentation
- consistent errors
- authentication
- authorisation
- rate limiting
- request size limits
- timeouts

## 13.4 Identity

Learn concepts:

- password hashing
- sessions
- cookies
- JWT
- OAuth concepts
- RBAC
- least privilege

## 13.5 Application infrastructure

- connection pooling
- background jobs
- queues
- caching
- asynchronous processing
- WebSockets
- scheduled jobs

## 13.6 Backend projects

### Project A - CRUD API

Demonstrate:

- routing
- validation
- database access
- testing

### Project B - Authenticated API

Add:

- users
- password hashing
- sessions or token-based access
- roles

### Project C - URL shortener

Add:

- unique IDs
- redirects
- database
- caching
- analytics

### Project D - Real-time chat backend

Add:

- WebSockets
- authentication
- persistence
- concurrency reasoning

---

# 14. PHASE 9 - SOFTWARE ARCHITECTURE

# Target: 🟠 D3

Progression:

```text
Script
→ structured program
→ modules
→ layered application
→ modular monolith
→ service-oriented architecture
→ microservices
→ distributed architecture
```

Learn:

- separation of concerns
- dependency inversion
- modularity
- interfaces
- adapters
- dependency injection
- repositories
- service boundaries
- domain boundaries
- event-driven architecture
- message-driven architecture
- synchronous vs asynchronous communication
- design patterns
- architectural patterns

## Design-pattern families

Awareness/working level:

- Strategy
- Factory
- Adapter
- Observer
- Decorator
- Command
- Repository
- Dependency Injection

Do not memorise pattern names without understanding the underlying design problem.

## Critical rule

Do not build microservices because they look impressive.

First learn to design a good single service.

---

# 15. PHASE 10 - MATHEMATICS

# 15.1 Linear Algebra - 🔴 D4

## Foundations

- scalars
- vectors
- matrices
- matrix operations
- matrix multiplication
- transpose
- inverse
- systems of equations

## Vector spaces

- subspaces
- basis
- dimension
- rank
- null space
- column space
- linear independence
- linear transformations

## Geometry

- inner product
- norms
- distances
- orthogonality
- projections
- least-squares geometry

## Advanced

- eigenvalues
- eigenvectors
- diagonalisation
- positive-definite matrices
- quadratic forms
- SVD
- PCA
- tensor notation

## ML connections

You should know why linear algebra appears in:

- regression
- PCA
- covariance
- embeddings
- neural-network layers
- optimisation
- attention

### Required practice

Do numerical work by hand and with Python/NumPy.

Implement:

- matrix operations
- least squares
- PCA

---

# 15.2 Calculus - 🔴 D3–D4

Learn:

- functions
- limits
- continuity
- derivatives
- product rule
- quotient rule
- chain rule
- partial derivatives
- gradients
- directional derivatives
- Jacobians
- Hessians
- multivariable calculus

Connect directly to:

- gradient descent
- loss functions
- backpropagation
- optimisation
- sensitivity

You should be able to derive simple gradients rather than only recognise them.

---

# 15.3 Probability - 🔴 D3–D4

Learn:

- sample spaces
- events
- conditional probability
- Bayes theorem
- independence
- random variables
- PMF
- PDF
- CDF
- expectation
- variance
- covariance
- conditional expectation
- common distributions
- law of large numbers
- central limit theorem

Then:

- likelihood
- maximum likelihood estimation
- MAP
- Bayesian reasoning

---

# 15.4 Statistics - 🔴 D4

Learn:

- descriptive statistics
- sampling
- estimators
- bias
- variance
- consistency
- confidence intervals
- hypothesis testing
- p-values
- statistical power
- effect sizes
- regression
- ANOVA
- experimental design
- A/B testing
- Bayesian statistics

Important mindset:

> Statistics is not merely calculating summaries; it is reasoning under uncertainty.

---

# 15.5 Optimisation - 🟠 D3–D4

Learn:

- objective functions
- feasible regions
- convexity
- local vs global minima
- constrained optimisation
- gradients
- gradient methods
- SGD
- momentum
- Adam
- learning-rate schedules
- regularisation

Connect this to model training.

---

# 16. PHASE 11 - DATA SCIENCE

# Target: 🔴 D3–D4

## 16.1 Core stack

- Python
- NumPy
- Pandas
- SQL
- Matplotlib

## 16.2 Data workflow

```text
Question
→ data acquisition
→ inspection
→ validation
→ cleaning
→ exploration
→ hypothesis formation
→ analysis
→ modelling if appropriate
→ evaluation
→ communication
```

## 16.3 Data-quality reasoning

Inspect:

- missing values
- duplicates
- malformed records
- outliers
- anomalies
- distributions
- class imbalance
- leakage
- sampling problems
- selection bias
- temporal leakage
- inconsistent categories

## 16.4 Data projects

Build:

- public-data investigation
- time-series investigation
- business KPI analysis
- experiment analysis
- data-quality audit
- reproducible analytical report

## 16.5 Communication

Learn to communicate:

- finding
- evidence
- uncertainty
- limitations
- recommendation when appropriate

Do not turn every analysis into a dashboard when a clear written finding is more appropriate.

---

# 17. PHASE 12 - DATA ENGINEERING FOUNDATION

# Target: 🟡–🟠 D2–D3

The purpose is to understand how data moves through real systems.

Learn:

- ETL
- ELT
- batch processing
- streaming
- data ingestion
- schemas
- schema evolution
- data validation
- data lineage
- partitioning
- warehouses
- lakes
- basic orchestration

Later technologies:

- Airflow
- Spark
- Kafka

Learn each as a response to a real scaling or workflow problem.

## Data engineering project

Build:

```text
Raw source
→ ingestion
→ validation
→ transformation
→ PostgreSQL
→ analytical query
→ report
```

Then add a second version with batch scheduling and logging.

---

# 18. PHASE 13 - CLASSICAL MACHINE LEARNING

# Target: 🔴 D4

## 18.1 Problem formulation

Before model selection ask:

- What is the target?
- What is the unit of prediction?
- What is the available data?
- What information exists at prediction time?
- What is the cost of errors?
- What baseline should I beat?
- What metric matters?

## 18.2 Regression

Learn:

- linear regression
- polynomial regression
- Ridge
- Lasso
- Elastic Net

Understand:

- least squares
- residuals
- assumptions
- multicollinearity
- regularisation

## 18.3 Classification

Learn:

- logistic regression
- kNN
- Naive Bayes
- SVM
- decision trees
- random forests
- gradient boosting

## 18.4 Boosting

Understand:

- weak learners
- sequential correction
- residuals
- gradient boosting
- XGBoost
- LightGBM

Use mature implementations professionally after understanding the concepts.

## 18.5 Unsupervised learning

- k-means
- hierarchical clustering
- DBSCAN
- Gaussian mixture models
- PCA
- dimensionality reduction

Understand assumptions and failure modes.

---

# 19. PHASE 14 - MACHINE LEARNING THEORY

# Target: 🔴 D4

Learn:

- bias
- variance
- overfitting
- underfitting
- regularisation
- cross-validation
- hyperparameter tuning
- feature selection
- feature engineering
- leakage
- distribution shift
- imbalance
- calibration

## 19.1 Feature engineering

Learn:

- categorical encoding
- scaling
- transformations
- interaction features
- date/time features
- text-derived features
- missingness indicators
- domain-driven features

## 19.2 Leakage

Be able to distinguish:

- harmless preprocessing
- train/test leakage
- target leakage
- temporal leakage
- duplicate leakage

## 19.3 Baselines

Every ML project should have a baseline.

Examples:

- majority class
- mean predictor
- linear model
- simple heuristic

Do not jump directly to the fanciest model.

---

# 20. PHASE 15 - MODEL EVALUATION

# Target: 🔴 D4

## Classification metrics

Understand:

- accuracy
- precision
- recall
- specificity
- F1
- ROC-AUC
- PR-AUC
- log loss
- confusion matrix
- calibration

## Regression metrics

- MAE
- MSE
- RMSE
- R²
- MAPE awareness

## Evaluation design

Learn:

- train/validation/test separation
- cross-validation
- grouped splits
- temporal splits
- stratification
- confidence intervals where useful
- uncertainty

## Metric selection

Always ask:

> What type of error matters operationally?

Not merely:

> Which metric gives the biggest number?

---

# 21. PHASE 16 - FROM-SCRATCH ML IMPLEMENTATION

Implement selected algorithms with NumPy before relying entirely on libraries.

Required candidates:

1. Linear regression
2. Gradient descent
3. Logistic regression
4. k-means
5. PCA
6. Selected decision-tree components
7. Simple neural network
8. Backpropagation

For every implementation document:

- mathematical formulation
- data flow
- computational complexity
- assumptions
- limitations
- comparison with library implementation

Then transition to scikit-learn for robust workflows.

---

# 22. PHASE 17 - TIME SERIES

# Target: 🟠 D2–D3

Useful for Data Science, finance, operations, forecasting, and many production settings.

Learn:

- temporal indexing
- trend
- seasonality
- stationarity
- autocorrelation
- lag features
- rolling windows
- temporal cross-validation
- forecasting baselines
- error evaluation

Later:

- ARIMA awareness
- state-space awareness
- exponential smoothing
- machine-learning forecasting
- deep-learning forecasting awareness

Critical rule:

Never randomly split a genuinely temporal dataset in a way that leaks future information into the past.

---

# 23. PHASE 18 - RECOMMENDER SYSTEMS

# Target: 🟠 D3

This is an important bridge between ML and systems.

Learn:

- recommendation problem formulation
- candidate generation
- ranking
- collaborative filtering
- content-based approaches
- embeddings
- similarity
- cold start
- implicit feedback
- explicit feedback
- negative sampling
- offline evaluation
- online experimentation

Architecture:

```text
User activity
→ event ingestion
→ feature generation
→ candidate generation
→ ranking
→ serving
→ feedback
```

Project:

Build a recommendation system, then design how it would evolve from a local prototype into a production system.

---

# 24. PHASE 19 - DEEP LEARNING

# Target: 🔴 D4

Primary framework: PyTorch.

## 24.1 Neural-network foundations

Learn:

- perceptron
- linear layer
- nonlinear activation
- MLP
- forward pass
- loss function
- backpropagation
- gradient descent

## 24.2 Activations

Understand:

- sigmoid
- tanh
- ReLU
- variants of ReLU
- softmax

Understand why activation functions affect optimisation and expressiveness.

## 24.3 Training

Learn:

- initialisation
- learning rates
- batch size
- epochs
- minibatch SGD
- momentum
- Adam
- schedulers
- weight decay
- dropout
- batch normalisation
- early stopping

## 24.4 Failure modes

Understand:

- overfitting
- underfitting
- exploding gradients
- vanishing gradients
- unstable training
- poor initialisation
- data problems

## 24.5 Required builds

- linear regression in PyTorch
- MLP classifier
- custom training loop
- experiment comparison
- model checkpointing

---

# 25. PHASE 20 - COMPUTER VISION

# Target: 🟡–🟠 D2–D3

Learn:

- image representation
- convolution
- kernels
- padding
- stride
- pooling
- CNNs
- augmentation
- transfer learning
- image classification
- object detection awareness
- segmentation awareness

Conceptual architecture progression:

- LeNet
- AlexNet
- VGG
- ResNet

The objective is historical and conceptual understanding, not architecture memorisation.

Projects:

- image classifier
- transfer-learning classifier
- detection project
- document/industrial image analysis

---

# 26. PHASE 21 - SEQUENCE MODELS AND NLP

# Target: 🟠 D3

Learn:

- sequences
- tokens
- vocabulary
- embeddings
- sequence classification
- RNNs
- hidden state
- LSTM
- GRU
- sequence-to-sequence
- teacher forcing awareness

Then move toward attention and Transformers.

---

# 27. PHASE 22 - ATTENTION AND TRANSFORMERS

# Target: 🔴 D4

This is a major conceptual milestone.

Learn:

- query
- key
- value
- attention scores
- scaled dot-product attention
- softmax
- masking
- multi-head attention
- positional information
- residual connections
- layer normalisation
- feed-forward blocks
- encoder
- decoder
- autoregressive generation

## Required understanding

You should be able to explain why attention works as a mechanism for selecting and combining information.

## Required build

Implement a small Transformer from scratch.

Suggested progression:

1. token embeddings
2. positional representation
3. single-head attention
4. multi-head attention
5. feed-forward block
6. residual connections
7. layer normalization
8. causal masking
9. training loop
10. text generation

The model can be tiny. The purpose is understanding.

---

# 28. PHASE 23 - MODERN LLM ENGINEERING

# Target: 🔴 D3–D4

## 28.1 Tokenisation

Learn:

- tokens
- token IDs
- vocabulary
- subword tokenisation
- BPE
- WordPiece awareness
- sequence length
- context window

## 28.2 Embeddings

Learn:

- representation
- vector similarity
- cosine similarity
- semantic search
- dense retrieval

## 28.3 Model lifecycle

Understand:

- pretraining
- next-token prediction
- fine-tuning
- instruction tuning
- preference optimisation
- RLHF concepts
- parameter-efficient fine-tuning

## 28.4 Fine-tuning

Learn:

- LoRA
- PEFT
- dataset formatting
- evaluation splits
- overfitting
- catastrophic forgetting awareness
- training-cost reasoning

## 28.5 Inference

Learn:

- batching
- throughput
- latency
- KV cache
- quantisation
- context management
- serving
- model routing awareness

## 28.6 Tooling

Use the Hugging Face ecosystem as a core reference point.

Reference:
https://huggingface.co/docs/transformers

Do not become a wrapper-only LLM developer.

---

# 29. PHASE 24 - RETRIEVAL-AUGMENTED GENERATION

# Target: 🔴 D3

Understand RAG as an information-retrieval system plus a generation system.

```text
Documents
→ parsing
→ cleaning
→ chunking
→ metadata
→ embedding/indexing
→ query
→ retrieval
→ filtering
→ reranking
→ context assembly
→ LLM
→ answer
→ evaluation
```

Learn:

- document ingestion
- parsing
- chunking strategies
- overlap
- metadata
- dense retrieval
- sparse retrieval
- hybrid retrieval
- vector indexes
- reranking
- query rewriting
- context compression
- citation grounding
- retrieval metrics
- generation metrics

## Failure modes

- bad parsing
- wrong chunk boundaries
- poor retrieval
- irrelevant retrieval
- context overload
- hallucination
- stale documents
- access-control failures
- prompt injection

## Required project

Build a production-style document research system with:

- ingestion
- indexing
- retrieval
- reranking
- generation
- citations
- evaluation
- authentication
- logging

---

# 30. PHASE 25 - AI AGENTS

# Target: 🟠 D2–D3

Learn the spectrum:

```text
Deterministic function
→ tool call
→ workflow
→ stateful workflow
→ planning
→ agent
→ multi-step agent
→ multi-agent system
```

Learn:

- function calling
- tool definitions
- schema validation
- state
- memory
- planning
- execution
- retries
- timeouts
- tool errors
- guardrails
- observability
- evaluation

Critical principle:

> An agent is not automatically better than a deterministic workflow.

Use agents when the problem benefits from flexible decision-making.

Avoid creating agent complexity where a normal program is clearer and more reliable.

---

# 31. PHASE 26 - MULTIMODAL AI

# Target: 🟡–🟠 D2–D3

Learn conceptually:

- vision-language models
- image embeddings
- speech/text relationships
- audio models
- multimodal tokenisation awareness
- multimodal retrieval
- document intelligence

Potential projects:

- image question-answering system
- document understanding system
- multimodal search

Do not specialise here unless your later path points this way.

---

# 32. PHASE 27 - AI EVALUATION

# Target: 🔴 D3

AI systems need tests.

Learn to evaluate:

- correctness
- relevance
- groundedness
- factual consistency
- hallucination
- retrieval quality
- tool-use accuracy
- reliability
- latency
- cost
- safety

## Evaluation loop

```text
Define objective
→ define metric
→ build dataset
→ establish baseline
→ run system
→ analyse failures
→ improve
→ regression test
```

## Evaluation levels

### Unit level

Does a component behave correctly?

### Retrieval level

Did we retrieve the right evidence?

### Generation level

Did the model answer appropriately?

### System level

Does the whole product satisfy user requirements?

### Online level

Does real-world use improve or degrade outcomes?

---

# 33. PHASE 28 - ML ENGINEERING

# Target: 🔴 D4

This is the bridge from ML practitioner to ML engineer.

Learn:

- project structure
- configuration
- reproducibility
- deterministic runs where possible
- data validation
- feature pipelines
- training pipelines
- evaluation pipelines
- inference pipelines
- experiment tracking
- data versioning
- model versioning
- model registry concepts
- model packaging
- API serving
- batch inference
- online inference
- model monitoring
- drift detection
- rollback
- retraining

## Standard lifecycle

```text
Data
→ validation
→ feature generation
→ training
→ experiment tracking
→ evaluation
→ model registry
→ packaging
→ deployment
→ inference
→ monitoring
→ drift
→ retraining
```

## Production questions

For every model ask:

- How is the model trained?
- What data version trained it?
- Which code version trained it?
- Which hyperparameters were used?
- What was the baseline?
- What metric improved?
- How is the model packaged?
- How is inference served?
- What is latency?
- How is failure handled?
- How is performance monitored?
- When is retraining triggered?

---

# 34. PHASE 29 - MODEL SERVING

# Target: 🔴 D3

## Batch inference

Use when predictions can be generated periodically.

Understand:

- scheduling
- data snapshots
- output persistence
- idempotency
- reruns

## Online inference

Use when predictions must be returned in real time.

Understand:

- latency
- throughput
- concurrency
- timeouts
- autoscaling
- batching
- cold starts

## Serving project

Build:

```text
Client
→ API
→ validation
→ model
→ prediction
→ logging
→ metrics
```

Then add:

- Docker
- CI/CD
- cloud deployment
- monitoring

---

# 35. PHASE 30 - MLOPS

# Target: 🔴 D3–D4

## Level 1

- Git
- environments
- packaging
- testing
- Docker

## Level 2

- data validation
- experiment tracking
- model registry
- CI/CD

## Level 3

- deployment
- monitoring
- drift
- observability

## Level 4

- orchestration
- feature stores
- distributed training
- advanced serving
- infrastructure automation

Do not learn tools without understanding the ML lifecycle they support.

---

# 36. PHASE 31 - DEVOPS

# Target: 🟠 D3

Learn:

- Linux
- networking
- Git
- shell
- SSH
- processes
- logs
- containers
- CI/CD
- registries
- reverse proxies
- observability
- secrets
- deployment strategies

## Docker

Master:

- images
- containers
- Dockerfiles
- layers
- volumes
- networks
- Compose
- registries
- environment configuration

Reference:
https://docs.docker.com/get-started/

## CI/CD

Use GitHub Actions initially.

Build pipelines that:

1. install dependencies
2. run tests
3. lint
4. type-check
5. build
6. publish artifacts/images
7. deploy

Do not let CI become a ritual. Understand what each stage protects you from.

---

# 37. PHASE 32 - CLOUD

# Target: 🟠 D2–D3

Learn one provider deeply enough to deploy actual systems.

A reasonable first-provider strategy is AWS, but this is a recommendation, not a permanent requirement.

Learn cloud concepts:

- regions
- availability zones
- compute
- storage
- networking
- identity and access
- managed databases
- containers
- serverless
- load balancing
- DNS
- monitoring
- secrets
- cost management

Do not memorise service names without understanding the architecture behind them.

## Required cloud project

Deploy a real backend or ML inference service with:

- networking
- identity
- storage/database
- logs
- monitoring
- deployment automation

---

# 38. PHASE 33 - TERRAFORM / INFRASTRUCTURE AS CODE

# Target: 🟡–🟠 D2–D3

Learn:

- infrastructure as code
- configuration language
- providers
- resources
- variables
- outputs
- state
- plan
- apply
- modules
- environments
- secrets
- state security

Core workflow:

```text
Write
→ Plan
→ Apply
```

Terraform is designed to define, version, and manage infrastructure through declarative configuration and provider APIs. Reference:
https://developer.hashicorp.com/terraform/intro

Do not commit sensitive state or credentials.

---

# 39. PHASE 34 - KUBERNETES

# Target: 🟡 D2 initially, D3 later

Prerequisites:

- Linux
- networking
- Docker
- cloud basics

Learn:

- cluster concepts
- control plane
- worker nodes
- Pods
- Deployments
- Services
- ConfigMaps
- Secrets
- Ingress
- Jobs
- health checks
- resource requests/limits
- autoscaling
- namespaces

Reference:
https://kubernetes.io/docs/concepts/

Understand the problem Kubernetes solves before memorising Kubernetes objects.

Do not learn Kubernetes merely because job descriptions contain the word.

---

# 40. PHASE 35 - SYSTEM DESIGN

# Target: 🔴 D3–D4

System-design progression:

```text
Single service
→ database
→ cache
→ queue
→ load balancer
→ replication
→ partitioning
→ scaling
→ distributed systems
→ reliability
→ observability
```

## Standard design process

1. Clarify requirements.
2. Separate functional and non-functional requirements.
3. Estimate scale.
4. Define API.
5. Define data model.
6. Draw high-level architecture.
7. Identify bottlenecks.
8. Discuss storage and caching.
9. Discuss failure modes.
10. Discuss scalability.
11. Discuss observability.
12. Explain trade-offs.

## Core concepts

- availability
- reliability
- latency
- throughput
- consistency
- durability
- idempotency
- retries
- timeouts
- backpressure
- caching
- queues
- replication
- partitioning
- sharding
- rate limiting
- load balancing
- CDN
- observability

## Systems to design

- URL shortener
- chat system
- notification system
- file storage service
- search system
- ride-sharing system
- recommendation platform
- fraud-detection platform
- ML serving platform
- RAG service

---

# 41. PHASE 36 - DISTRIBUTED SYSTEMS

# Target: 🟠 D3

Learn:

- distributed-system characteristics
- failure is normal
- network partitions
- replication
- leader/follower
- consistency models
- eventual consistency
- quorum concepts
- partitioning
- idempotency
- retries
- duplicate delivery
- ordering
- backpressure
- fault tolerance

Advanced awareness:

- consensus
- Raft
- distributed transactions
- exactly-once vs at-least-once
- event sourcing

Do not begin with advanced consensus before understanding basic distributed-system failure modes.

---

# 42. PHASE 37 - ML SYSTEM DESIGN

# Target: 🔴 D3–D4

This is where your software + ML combination becomes especially valuable.

## Recommendation system

```text
User events
→ event pipeline
→ feature generation
→ candidate generation
→ ranking
→ serving
→ feedback
```

Questions:

- What is computed offline?
- What is online?
- How fresh must data be?
- What is the latency budget?
- How do you evaluate ranking?
- How do you handle cold-start users?

## Fraud detection

```text
Transaction
→ ingestion
→ feature computation
→ model
→ risk score
→ policy/decision
→ logging
→ monitoring
```

Questions:

- latency
- false positives
- false negatives
- concept drift
- feedback delay
- adversarial behaviour

## Search

```text
Documents
→ indexing
→ query
→ retrieval
→ ranking
→ results
```

## Model-serving platform

```text
Client
→ gateway
→ routing
→ inference service
→ model
→ result
→ telemetry
```

## RAG system

```text
Documents
→ ingestion
→ indexing
→ retrieval
→ reranking
→ generation
→ evaluation
```

---

# 43. PHASE 38 - OBSERVABILITY

# Target: 🟠 D3

Learn the distinction between:

- logs
- metrics
- traces

## Metrics

Monitor:

- request count
- error rate
- latency
- throughput
- CPU
- memory
- model latency
- prediction distribution
- data freshness
- drift

## Logging

Logs should help answer:

- what happened?
- when?
- where?
- with what request/model version?

Do not log secrets or sensitive data carelessly.

## Tracing

Understand:

- request path
- service boundaries
- dependency latency
- bottleneck location

---

# 44. PHASE 39 - SECURITY

# Target: 🔴 D3

Security is not a separate department in your mental model.

## General

Learn:

- authentication
- authorisation
- password hashing
- encryption concepts
- TLS
- secrets
- least privilege
- dependency security
- secure API design
- input validation
- threat modelling

## Common web risks

Understand:

- SQL injection
- XSS
- CSRF
- SSRF
- insecure direct object references
- broken access control
- credential leakage
- insecure dependencies

## AI security

Learn:

- prompt injection
- indirect prompt injection
- data exfiltration
- tool misuse
- retrieval poisoning
- malicious documents
- agent privilege escalation
- evaluation manipulation
- model abuse

---

# 45. PHASE 40 - RESEARCH SKILLS

GATE: light paper reading may happen earlier, but the full research phase is unlocked after Checkpoint 5 and ideally Checkpoint 6. It must not compete with the foundational sequence.

# Target: 🟠 D3 → D5 if specialization demands it

## Reading papers

For every paper ask:

1. What problem?
2. Why is it difficult?
3. What existed before?
4. What is novel?
5. What assumptions are being made?
6. What data is used?
7. What is the baseline?
8. What metric is used?
9. What experiments support the claim?
10. What are the limitations?

## Reproduction ladder

```text
Read
→ understand
→ implement
→ reproduce
→ validate
→ modify
→ ablate
→ benchmark
→ hypothesize
→ experiment
→ write
```

## Experimental discipline

Track:

- dataset version
- code version
- hyperparameters
- seeds
- hardware
- runtime
- metrics
- baselines
- experiment notes

## Research writing

Learn to structure:

- problem
- related work
- method
- experimental setup
- results
- ablation
- limitations
- conclusion

Potential goal:

Produce at least one research-quality reproduction before attempting original work.

---

# 46. PHASE 41 - REINFORCEMENT LEARNING

GATE: optional branch. Do not enter before strong foundations and Checkpoint 5 unless a specific project or research direction requires it.

# Target: 🟢 D2 initially

Learn only after strong foundations unless your specialization requires it.

Topics:

- Markov Decision Processes
- states
- actions
- rewards
- policies
- value functions
- Q-learning
- policy gradients
- actor-critic
- deep RL awareness

Potential project:

- simple grid-world agent

Do not let RL displace core software, ML, statistics, systems, or DSA work unless it becomes strategically relevant.

---

# 47. PHASE 42 - ADVANCED ML SYSTEM TOPICS

GATE: unlocked after Checkpoint 5 and meaningful model-serving experience.

# Target: 🟠–🔴 D3–D4

Study when the foundations are mature.

## Feature stores

Understand:

- offline features
- online features
- point-in-time correctness
- feature freshness
- serving requirements

## Distributed training

Understand conceptually:

- data parallelism
- model parallelism
- distributed optimisation
- communication overhead
- checkpointing

## Model optimisation

Learn:

- quantisation
- pruning awareness
- distillation
- batching
- caching
- compilation awareness

## High-scale inference

Reason about:

- throughput
- latency
- batching
- memory
- model size
- routing
- replicas
- autoscaling

---

# 48. PHASE 43 - DATA / ML INFRASTRUCTURE

GATE: learn on demand after the underlying data, backend, deployment, and ML lifecycle concepts are working.

# Target: 🟡–🟠 D2–D3

Possible technologies:

- Airflow
- Spark
- Kafka
- data warehouses
- feature stores
- model registries

Do not collect technologies.

Learn them through real problems:

### Kafka

Learn when events must be streamed reliably.

### Spark

Learn when distributed batch computation becomes necessary.

### Airflow

Learn when scheduled workflows need orchestration.

### Feature store

Learn when feature consistency and serving become hard enough to require one.

---

# 49. PHASE 44 - AI ENGINEERING AS A SYSTEMS DISCIPLINE

GATE: unlocked after core software engineering, backend, model, evaluation, and deployment competencies are established.

# Target: 🔴 D3–D4

Modern AI engineering should combine:

- model understanding
- software engineering
- retrieval
- APIs
- data pipelines
- evaluation
- observability
- security
- cost management

A production AI system is not merely a prompt.

Think:

```text
User
↓
API
↓
Auth
↓
Application logic
↓
Retrieval / tools
↓
Model
↓
Validation
↓
Response
↓
Evaluation / telemetry
```

Every layer can fail.

---

# 50. PHASE 45 - COST ENGINEERING

GATE: learn through real deployed systems rather than as an early standalone subject.

# Target: 🟡–🟠 D2–D3

Learn to reason about:

- compute cost
- storage cost
- network cost
- model inference cost
- training cost
- database cost
- cache cost
- operational complexity

For AI:

- tokens
- context length
- model size
- batching
- caching
- model routing
- model quality vs cost

A technically elegant system that costs ten times more than necessary is not automatically a better engineering solution.

---

# 51. PHASE 46 - PRODUCT THINKING FOR ENGINEERS

GATE: awareness can begin early; detailed product engineering belongs alongside real projects and internships.

# Target: 🟡 D2–D3

Learn to connect technical decisions to user needs.

Understand:

- requirements
- constraints
- user journeys
- success metrics
- trade-offs
- MVP thinking
- failure cost
- operational requirements

Before building ML ask:

- Can a rule solve this?
- Can search solve this?
- Is the data sufficient?
- What happens if the model is wrong?
- Who uses the result?

---

# 52. PROJECT ARCHITECTURE: THE LONG-TERM LADDER

Projects are evidence of competence.

Do not build projects merely because they sound impressive.

Each project should force new knowledge to interact with old knowledge.

---

# 53. PROJECT 1 - CLI TOOL

Examples:

- expense tracker
- task manager
- file organiser
- log processor

Must demonstrate:

- Python
- functions
- data structures
- error handling
- Git
- testing

---

# 54. PROJECT 2 - API CLIENT / AUTOMATION TOOL

Build a CLI application consuming a public API.

Learn:

- HTTP
- JSON
- authentication basics
- retries
- errors
- rate limits
- logging

---

# 55. PROJECT 3 - DATABASE-BACKED API

Build a CRUD backend.

Required:

- PostgreSQL
- API
- validation
- migrations
- tests
- README

---

# 56. PROJECT 4 - URL SHORTENER

Requirements:

- short IDs
- redirect logic
- persistent storage
- unique constraints
- analytics
- rate limiting
- cache

Then analyse:

- expected traffic
- bottlenecks
- failure modes
- scaling path

---

# 57. PROJECT 5 - REAL-TIME CHAT BACKEND

Requirements:

- authentication
- WebSockets
- message persistence
- online/offline handling
- retries
- concurrency reasoning

Stretch:

- presence
- delivery status
- message pagination

---

# 58. PROJECT 6 - ANALYTICS PLATFORM

Pipeline:

```text
Raw data
→ cleaning
→ validation
→ PostgreSQL
→ SQL analysis
→ Python analysis
→ visualisation
→ report
```

Required:

- reproducibility
- clear assumptions
- data dictionary
- findings
- limitations

---

# 59. PROJECT 7 - FRAUD DETECTION PLATFORM

If you already have a fraud-detection project, do not automatically rebuild a near-duplicate. Treat the existing work as the starting artifact and upgrade it until it satisfies this project's engineering, evaluation, deployment, and monitoring requirements.

Pipeline:

```text
Data
→ validation
→ feature engineering
→ train/validation/test
→ baseline
→ model comparison
→ evaluation
→ API
→ deployment
→ monitoring
```

Required questions:

- How severe are false positives?
- What is the class imbalance?
- Is there temporal leakage?
- How does drift appear?
- How do you choose the threshold?

---

# 60. PROJECT 8 - RECOMMENDATION SYSTEM

Build:

- event ingestion
- user/item representations
- candidate retrieval
- ranking
- evaluation
- serving API

Then design the production version.

---

# 61. PROJECT 9 - ML SERVING PLATFORM

Goal: turn multiple models into a consistent serving system.

Learn:

- model registry
- model selection
- versioning
- inference API
- latency
- batching
- health checks
- monitoring

---

# 62. PROJECT 10 - RAG RESEARCH PLATFORM

Build a system that accepts a body of documents and supports grounded research.

Required:

- ingestion
- parsing
- chunking
- embeddings
- retrieval
- reranking
- generation
- citations
- evaluation
- auth
- logging
- security

---

# 63. PROJECT 11 - INTELLIGENT FINANCIAL RESEARCH PLATFORM

A large end-to-end capstone combining:

- frontend
- backend
- authentication
- PostgreSQL
- analytics
- ML
- RAG
- evaluation
- Docker
- CI/CD
- cloud
- observability

Potential architecture:

```text
User
↓
API Gateway
├── User Service
├── Data Service
├── Analytics Service
└── AI Service
        ├── Retrieval
        ├── Model
        └── Evaluation

Data Service
→ ingestion
→ transformation
→ PostgreSQL / analytical storage
→ features

ML layer
→ training
→ evaluation
→ registry
→ serving

Observability
→ logs
→ metrics
→ traces
```

Required documentation:

- architecture diagram
- requirements
- API documentation
- data model
- model card
- evaluation report
- threat model
- performance report
- cost analysis
- deployment guide

---

# 64. PROJECT QUALITY STANDARD

For every serious project, produce:

1. Problem statement
2. Requirements
3. Architecture
4. Technology justification
5. Data model
6. Implementation
7. Tests
8. Error-handling strategy
9. Security considerations
10. Deployment
11. Monitoring
12. Performance analysis
13. Limitations
14. Future improvements
15. README

For ML projects additionally:

- dataset description
- target definition
- baseline
- split strategy
- metrics
- feature pipeline
- model comparison
- error analysis
- reproducibility information

For AI projects additionally:

- evaluation dataset
- retrieval evaluation
- hallucination/failure analysis
- prompt/tool security
- cost considerations

---

# 65. CONTINUOUS TRACK - DSA / INTERVIEW PREPARATION

Do not postpone DSA until job applications.

Keep it alive for years.

Early phase:

- 2–3 focused sessions per week

Intermediate phase:

- 3–5 sessions per week during interview preparation

Final recruiting phase:

- timed practice
- mocks
- review of weak patterns

Maintain a mistake log:

- what I missed
- why I missed it
- pattern involved
- better approach
- recurrence of mistake

---

# 66. CONTINUOUS TRACK - FAANG / TOP-TIER TECH

The dream requires preparation beyond merely knowing the stack.

## 66.1 Coding interviews

Required:

- DSA
- complexity
- communication
- clean implementation
- edge cases

## 66.2 CS interviews

Be prepared to discuss:

- OS
- networking
- databases
- concurrency
- memory
- systems

## 66.3 System design

Progress:

```text
single-service design
→ common distributed components
→ scaling
→ distributed systems
→ large-scale system design
→ ML system design
```

## 66.4 ML system design

Practice:

- recommendation
- search/ranking
- fraud
- ad prediction awareness
- real-time inference
- model-serving systems
- RAG
- LLM applications

## 66.5 Behavioural

Develop real stories around:

- ownership
- failure
- ambiguity
- conflict
- leadership
- teamwork
- difficult debugging
- impact
- technical trade-offs

Do not fabricate stories.

## 66.6 Project deep dives

For every serious project be able to answer:

- Why this problem?
- What were the constraints?
- Why this architecture?
- What alternatives did you reject?
- What broke?
- How did you debug it?
- What would you change at 10× scale?
- What metrics mattered?
- What did you personally implement?

---

# 67. CONTINUOUS TRACK - RESUME

Your resume should eventually demonstrate:

- technical depth
- measurable outcomes where genuine
- internships
- projects
- research/open-source evidence
- leadership where real

Avoid keyword stuffing.

A bullet should ideally communicate:

**action + technical method + outcome**

Do not claim scale, performance, or impact that was not actually achieved.

---

# 68. CONTINUOUS TRACK - GITHUB

Target qualities:

- readable code
- good README
- tests
- meaningful history
- issue tracking
- architecture notes
- project demos
- reproducibility

Better:

**five excellent repositories**

than:

**fifty tutorial clones.**

---

# 69. CONTINUOUS TRACK - OPEN SOURCE

Progression:

```text
Read codebase
→ documentation improvement
→ small bug fix
→ feature
→ larger contribution
→ sustained contribution
```

Look for ecosystems adjacent to your actual roadmap.

Potential areas:

- Python
- PyTorch
- Hugging Face
- scikit-learn
- FastAPI
- data tooling

Quality matters more than contribution count.

---

# 70. CONTINUOUS TRACK - TECHNICAL WRITING

Write:

- project READMEs
- architecture notes
- experiment reports
- debugging writeups
- concept explanations
- research summaries

Recommended structure:

```text
Problem
→ context
→ approach
→ alternatives
→ implementation
→ result
→ failure
→ lesson
→ next step
```

Writing also forces precise thinking.

---

# 71. CONTINUOUS TRACK - RESEARCH

Progression:

```text
Paper
→ notes
→ implementation
→ reproduction
→ variation
→ experiment
```

Do not rush into “original research” before you can reproduce existing work.

---

# 72. INTERNSHIP STRATEGY

Internships are not merely CV decorations.

They should progressively increase exposure to:

- real codebases
- real users
- real constraints
- real teams
- production systems

Possible trajectory:

```text
University projects
→ first technical experience
→ stronger internship
→ SWE/ML experience
→ top-tier internship
→ new-grad opportunities
```

This is a strategy, not a guaranteed sequence.

## Internship evidence to seek

- meaningful code contributions
- production exposure
- measurable improvements where genuine
- technical ownership
- debugging
- collaboration
- architecture exposure

---

# 72.1 INTERNATIONAL / CROSS-BORDER CAREER REALITY

For international students and candidates targeting opportunities outside their home country, technical strength is necessary but not always sufficient. Recruiting can also depend on:

- work authorization
- visa sponsorship
- employer location constraints
- relocation requirements
- internship eligibility
- remote-work eligibility
- timing and application windows

Do not let this become an early source of anxiety or a reason to stop building. Revisit it when targeting specific companies, countries, internships, postgraduate programmes, or work arrangements.

The roadmap should optimise first for transferable technical capability and evidence. Career logistics should then be checked against the actual opportunity.

# 73. PORTFOLIO STRATEGY BY STAGE

## Stage A - Beginner

Show:

- clean code
- simple applications
- basic data work

## Stage B - Intermediate

Show:

- backend
- databases
- testing
- deployment
- classical ML

## Stage C - Advanced

Show:

- ML engineering
- systems
- deep learning
- MLOps
- serious projects

## Stage D - Elite-track candidate

Show a coherent body of:

- strong projects
- internships
- research/open-source evidence
- DSA readiness
- system-design readiness
- communication

---

# 74. CERTIFICATION STRATEGY

Certification hierarchy for this career:

### Highest practical evidence

- strong internship
- production experience
- excellent project
- meaningful open source
- research output

### Useful selectively

- cloud certification
- role-specific certification where a target employer values it

### Usually low priority

- accumulating certificates without corresponding projects

Ask:

> What capability does this certificate prove?

If the answer is unclear, it is probably not a core priority.

---

# 75. WHAT NOT TO GET DISTRACTED BY

## Framework collecting

Do not become an encyclopaedia of frameworks.

## Premature microservices

Learn good single-service design first.

## Premature Kubernetes

Learn Linux, Docker, networking, and cloud first.

## Excessive frontend

Build enough UI to make products usable.

## Prompt-only AI

Prompting is a tool, not an engineering foundation.

## Technology hype

Ask whether a new technology solves a problem you actually have.

## Tutorial addiction

Courses are inputs. Projects and problem-solving are outputs.

## Over-mathematical rabbit holes

Learn the mathematics that improves your understanding. Specialise deeper when your work requires it.

## Premature optimisation

Measure first.

## Productivity-system obsession

Planning is valuable. Excessive planning can become avoidance.

---

# 76. RESOURCE SYSTEM AND COVERAGE ATLAS

This section turns the roadmap from a topic map into a **learnable curriculum with resource routing**.

The resource choices follow a deliberate pattern:

```text
Beginner-friendly teaching
        ↓
Practice and implementation
        ↓
Official documentation
        ↓
Deep university/textbook references
        ↓
Specifications / source / papers
        ↓
Production systems and original work
```

The links below are resource anchors, not a demand to consume every item. Core anchors were checked against current public pages on **2026-09-17**. Fast-moving technical ecosystems must be rechecked at the moment you activate the phase.

## 76.1 RESOURCE STATUS LABELS

- **CORE:** default resource for the active path.
- **PRACTICE:** used to force retrieval and problem solving.
- **REFERENCE:** authoritative lookup source.
- **DEEP:** use when the target depth requires more than the primary course.
- **IMPLEMENT:** use while building.
- **OPTIONAL:** useful, but not required for the common path.
- **RECHECK:** changing ecosystem; verify the current version when activated.

## 76.2 RESOURCE SELECTION RULE

For every major phase, the roadmap provides at least one deliberate path for:

1. **Learning** - how the concept is taught.
2. **Practice** - how the concept is exercised.
3. **Reference** - where exact behavior is verified.
4. **Depth** - where deeper theory is developed.
5. **Implementation** - what proves that the knowledge can be used.

A tiny concept does **not** need a separate course if it is naturally covered by the parent resource. For example, list slicing inherits coverage from the Python curriculum and Python reference; TCP headers inherit coverage from the networking curriculum and the relevant protocol references. This keeps the roadmap complete without creating a useless pile of hyperlinks.

## 76.3 GLOBAL NAVIGATION RESOURCES

### roadmap.sh - map of the ecosystem
CORE / NAVIGATION
https://roadmap.sh/

Use role roadmaps for external cross-checking and discovery. Do not use roadmap.sh as the sole curriculum because its job is to map roles and technologies, not to teach every concept to the depth required here.

### MIT OpenCourseWare
CORE / UNIVERSITY LIBRARY
https://ocw.mit.edu/

### Harvard CS50 family
CORE / BEGINNER CS SUPPORT
https://cs50.harvard.edu/

### The Odin Project
OPTIONAL / WEB ENGINEERING
https://www.theodinproject.com/

### freeCodeCamp
OPTIONAL / PRACTICE + WEB + PYTHON SUPPORT
https://www.freecodecamp.org/learn/

### Coursera
OPTIONAL / STRUCTURED SPECIALISATIONS
https://www.coursera.org/

Use it when a specific course is genuinely better suited to a gap or when a credential itself has a concrete reason to exist. Do not turn the roadmap into certificate collection.

---

# 76.4 PHASE-BY-PHASE RESOURCE MAP

## PHASE 1 - PROGRAMMING FOUNDATIONS
**Concept coverage:** Python syntax, variables, expressions, conditionals, loops, functions, collections, strings, files, exceptions, modules, OOP introduction, testing introduction, typing introduction.

- **CORE:** Harvard CS50P
  https://cs50.harvard.edu/python/
- **PRACTICE:** Exercism Python
  https://exercism.org/tracks/python
- **REFERENCE:** Python documentation
  https://docs.python.org/3/
- **DEEP:** Python language reference and later CPython implementation reading
  https://docs.python.org/3/reference/
- **IMPLEMENT:** command-line utilities, text/file processors, small automation scripts.

**Resource progression:** do not replace CS50P with documentation on Day 1. Use the docs first for lookup, then increasingly for learning as fluency grows.

## PHASE 2 - GIT, GITHUB, DEVELOPMENT ENVIRONMENT
**Concept coverage:** repositories, commits, branches, remotes, merge/rebase, conflicts, tags, pull requests, code review, GitHub workflows, SSH keys, editor/terminal workflow.

- **CORE:** Pro Git
  https://git-scm.com/book/en/v2
- **PRACTICE:** GitHub Skills
  https://skills.github.com/
- **REFERENCE:** Git documentation
  https://git-scm.com/docs
- **DEEP:** Git internals/reference
  https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain
- **IMPLEMENT:** use Git on every roadmap project; recover from a deliberately created merge conflict.

## PHASE 3 - LINUX / CLI
**Concept coverage:** shell, files, permissions, processes, pipes, redirection, environment variables, SSH, text tools, package managers, process inspection, basic networking commands.

- **CORE:** MIT Missing Semester
  https://missing.csail.mit.edu/
- **PRACTICE:** shell tasks in your own projects and Linux command exercises.
- **REFERENCE:** `man` pages and GNU/Linux documentation.
- **DEEP:** The Linux Programming Interface, then kernel documentation when needed.
- **IMPLEMENT:** shell automation, log filtering, process inspection, SSH into a remote host.

## PHASE 4 - DATA STRUCTURES AND ALGORITHMS
**Concept coverage:** complexity, arrays, linked lists, stacks, queues, hashing, trees, heaps, tries, graphs, recursion, searching, sorting, greedy, backtracking, dynamic programming, graph algorithms, interview patterns.

- **CORE:** MIT 6.006 Introduction to Algorithms
  https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/
- **PRACTICE:** NeetCode
  https://neetcode.io/
- **INTERVIEW:** LeetCode
  https://leetcode.com/
- **DEEP:** Introduction to Algorithms, Cormen et al.; MIT 6.006 notes/problem sets remain the working spine.
- **IMPLEMENT:** implement core structures and selected algorithms yourself before using standard-library versions.

## PHASE 5 - CORE COMPUTER SCIENCE

### Operating Systems
- **CORE:** MIT 6.1810 Operating System Engineering
  https://pdos.csail.mit.edu/6.S081/2026/
- **PRACTICE:** xv6 labs/homework.
- **REFERENCE:** xv6 book and course notes.
- **DEEP:** Operating Systems: Three Easy Pieces
  https://pages.cs.wisc.edu/~remzi/OSTEP/

### Networking
- **CORE:** Stanford CS144 Computer Networking
  https://cs144.github.io/
- **PRACTICE:** networking labs, packet inspection, sockets.
- **REFERENCE:** MDN HTTP documentation
  https://developer.mozilla.org/en-US/docs/Web/HTTP
- **DEEP:** Computer Networking: A Top-Down Approach; RFCs for exact protocol behavior.

### Computer Architecture
- **CORE:** UC Berkeley CS61C
  https://cs61c.org/
- **PRACTICE:** architecture exercises and low-level programming.
- **REFERENCE:** course notes
  https://notes.cs61c.org/
- **DEEP:** Computer Organization and Design / Computer Architecture: A Quantitative Approach.

### Compilers / Runtimes
- **CORE:** Crafting Interpreters
  https://craftinginterpreters.com/
- **PRACTICE:** build a small interpreter.
- **REFERENCE:** language specifications and runtime docs once relevant.
- **DEEP:** Engineering a Compiler; LLVM documentation.

## PHASE 6 - DATABASES
**Concept coverage:** relational model, SQL, schema design, normalisation, indexes, transactions, isolation, query planning, storage, replication, partitioning, NoSQL awareness, caching.

- **CORE:** CMU 15-445/645 Intro to Database Systems
  https://15445.courses.cs.cmu.edu/fall2026/
- **BEGINNER PRACTICE:** SQLBolt
  https://sqlbolt.com/
- **REFERENCE:** PostgreSQL docs
  https://www.postgresql.org/docs/current/
- **DEEP:** Database Internals; CMU lecture material and labs.
- **IMPLEMENT:** build a database-backed application; inspect `EXPLAIN`; benchmark an index/no-index query.

### Redis
- **REFERENCE:** Redis docs
  https://redis.io/docs/latest/
- **IMPLEMENT:** caching, rate limiting, session data, queues where justified.

### NoSQL
- **REFERENCE:** MongoDB docs for document databases
  https://www.mongodb.com/docs/
- **DEEP:** Database Internals and distributed database literature.
- **RULE:** learn data-model tradeoffs before collecting databases by name.

## PHASE 7 - SOFTWARE ENGINEERING
**Concept coverage:** clean code, modularity, SOLID, cohesion/coupling, refactoring, testing, debugging, packaging, dependency management, versioning, code review, engineering workflow.

- **CORE:** Google Engineering Practices
  https://google.github.io/eng-practices/
- **PRACTICE:** refactor your own projects; write tests before/after changes.
- **REFERENCE:** language/tool documentation and Python Packaging User Guide
  https://packaging.python.org/en/latest/
- **TESTING REFERENCE:** pytest
  https://docs.pytest.org/en/stable/
- **DEEP:** Refactoring, Martin Fowler; Software Engineering at Google.
- **IMPLEMENT:** every serious project gets tests, logging, documentation, dependency pinning, and a repeatable setup.

### Java
- **CORE/reference:** dev.java Learn Java
  https://dev.java/learn/
- **PRACTICE:** university Java work and small independent Java programs.
- **TESTING:** JUnit 5 user guide
  https://junit.org/junit5/docs/current/user-guide/

### JavaScript / TypeScript
Activate only when the main programming foundation is dependable.
- **CORE:** The Odin Project Full Stack JavaScript path
  https://www.theodinproject.com/paths/2
- **REFERENCE:** MDN JavaScript Guide
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- **TYPE SYSTEM:** TypeScript Handbook
  https://www.typescriptlang.org/docs/handbook/
- **IMPLEMENT:** browser application, then Node.js service where useful.

## PHASE 8 - BACKEND ENGINEERING
**Concept coverage:** HTTP, REST, API design, validation, auth, sessions, JWT, OAuth/OIDC awareness, pagination, rate limits, error contracts, background jobs, queues, async work, WebSockets, caching, configuration, security.

- **CORE:** FastAPI Tutorial
  https://fastapi.tiangolo.com/tutorial/
- **REFERENCE:** MDN HTTP
  https://developer.mozilla.org/en-US/docs/Web/HTTP
- **SECURITY:** OWASP Web Security Testing Guide / PortSwigger Academy
  https://portswigger.net/web-security
- **DEEP:** API Design Patterns; HTTP/RFC references.
- **IMPLEMENT:** CRUD API → authenticated API → URL shortener → real-time backend.

### Optional Java backend lane
- **REFERENCE/IMPLEMENT:** Spring Boot
  https://spring.io/projects/spring-boot
- Use only when a project, internship, or role specifically benefits from Java backend depth.

## PHASE 9 - SOFTWARE ARCHITECTURE
**Concept coverage:** modularity, boundaries, layered architecture, dependency inversion, adapters, DI, repositories, domain boundaries, event-driven systems, synchronous vs asynchronous communication, patterns.

- **CORE:** Software Architecture in Practice / Martin Fowler architecture articles
  https://martinfowler.com/architecture/
- **REFERENCE:** AWS Well-Architected Framework
  https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
- **DEEP:** Designing Data-Intensive Applications
  https://dataintensive.net/
- **IMPLEMENT:** refactor a monolith from script → modules → layered design; split services only when a real boundary appears.

## PHASE 10 - MATHEMATICS

### Linear Algebra
- **CORE:** MIT 18.06 / 18.06SC
  https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/
- **PRACTICE:** problem sets + hand derivations + NumPy.
- **REFERENCE:** MIT notes and linear algebra reference material.
- **DEEP:** Linear Algebra Done Right or equivalent rigorous text when research depth demands it.

### Calculus
- **CORE:** MIT 18.01SC Single Variable Calculus
  https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/
- **SUPPLEMENT:** MIT 18.02 / multivariable calculus material when gradients/Jacobians become active.
- **DEEP:** Stewart or a rigorous alternative if needed for formal depth.

### Probability
- **CORE:** MIT probabilistic systems material
  https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/
- **PRACTICE:** problem sets, simulations, Monte Carlo experiments.
- **DEEP:** Introduction to Probability, Blitzstein and Hwang.

### Statistics
- **CORE:** OpenIntro Statistics
  https://www.openintro.org/book/os/
- **SUPPLEMENT:** An Introduction to Statistical Learning
  https://www.statlearning.com/
- **REFERENCE:** statistical software documentation and formal statistical texts as needed.

### Optimisation
- **CORE:** selected MIT/Stanford optimisation material tied directly to ML.
- **REFERENCE:** PyTorch optimisation documentation and algorithm references.
- **DEEP:** Convex Optimization by Boyd and Vandenberghe when the target work requires formal convex analysis.

## PHASE 11 - DATA SCIENCE
**Concept coverage:** NumPy, Pandas, data cleaning, joins, transformations, EDA, visualisation, statistical analysis, feature creation, reproducibility, communication.

- **CORE:** Kaggle Learn for short guided practice
  https://www.kaggle.com/learn
- **REFERENCE:** NumPy docs
  https://numpy.org/doc/
- **REFERENCE:** Pandas docs
  https://pandas.pydata.org/docs/
- **REFERENCE:** Matplotlib docs
  https://matplotlib.org/stable/
- **PRACTICE:** real datasets, university datasets, analysis writeups.
- **DEEP:** Practical Statistics for Data Scientists and your statistics coursework.

## PHASE 12 - DATA ENGINEERING FOUNDATION
**Concept coverage:** ingestion, ETL/ELT, batch processing, orchestration, data warehouses, streaming awareness, data quality, reproducibility.

- **CORE:** Data Engineering Zoomcamp
  https://datatalks.club/blog/data-engineering-zoomcamp.html
- **REFERENCE:** Apache Airflow docs
  https://airflow.apache.org/docs/
- **REFERENCE:** Apache Spark docs
  https://spark.apache.org/documentation/
- **REFERENCE:** Apache Kafka docs
  https://kafka.apache.org/documentation/
- **OPTIONAL:** dbt docs for analytics engineering
  https://docs.getdbt.com/
- **IMPLEMENT:** raw source → validation → transformation → PostgreSQL → analytics query → report, then schedule and log it.

## PHASE 13 - CLASSICAL MACHINE LEARNING
**Concept coverage:** regression, classification, trees, ensembles, boosting, clustering, dimensionality reduction, problem formulation.

- **CORE:** An Introduction to Statistical Learning
  https://www.statlearning.com/
- **PRACTICE / REFERENCE:** scikit-learn User Guide
  https://scikit-learn.org/stable/user_guide.html
- **DEEP:** Stanford CS229
  https://cs229.stanford.edu/
- **IMPLEMENT:** baseline → feature engineering → model comparison → evaluation report.

## PHASE 14 - MACHINE LEARNING THEORY
**Concept coverage:** bias/variance, regularisation, generalisation, feature engineering, leakage, distribution shift, imbalance, calibration, baselines.

- **CORE:** Stanford CS229 lectures/notes
  https://cs229.stanford.edu/
- **REFERENCE:** scikit-learn User Guide
  https://scikit-learn.org/stable/user_guide.html
- **DEEP:** The Elements of Statistical Learning
  https://hastie.su.domains/ElemStatLearn/
- **IMPLEMENT:** deliberately create leakage, imbalance, and overfitting failures and diagnose them.

## PHASE 15 - MODEL EVALUATION
**Concept coverage:** classification metrics, regression metrics, splits, cross-validation, temporal/grouped splits, calibration, uncertainty, operational metrics.

- **CORE:** ISLR + CS229 statistical learning material.
- **REFERENCE:** scikit-learn metrics/model_selection docs
  https://scikit-learn.org/stable/modules/classes.html
- **DEEP:** statistical decision theory and experiment design when research work demands it.
- **IMPLEMENT:** write an evaluation plan before training; justify the metric using the error costs.

## PHASE 16 - FROM-SCRATCH ML IMPLEMENTATION
**Concept coverage:** linear regression, gradient descent, logistic regression, k-means, PCA, tree components, simple neural network, backpropagation.

- **CORE:** CS229 notes + your mathematics notes.
- **PRACTICE:** NumPy-only implementations.
- **REFERENCE:** NumPy docs
  https://numpy.org/doc/
- **DEEP:** numerical optimisation and linear algebra references as gaps appear.
- **IMPLEMENT:** compare your implementation with scikit-learn/PyTorch behavior and complexity.

## PHASE 17 - TIME SERIES
**Concept coverage:** trend, seasonality, stationarity, forecasting, validation, lags, autoregressive models, modern ML forecasting awareness.

- **CORE:** Forecasting: Principles and Practice
  https://otexts.com/fpp3/
- **PRACTICE:** forecasting experiments with temporal validation.
- **REFERENCE:** statsmodels time-series docs
  https://www.statsmodels.org/stable/tsa.html
- **DEEP:** advanced forecasting literature when needed.

## PHASE 18 - RECOMMENDER SYSTEMS
**Concept coverage:** collaborative filtering, content-based recommendation, ranking, retrieval, cold start, feedback loops, offline/online evaluation.

- **CORE:** Google recommendation systems learning materials
  https://developers.google.com/machine-learning/recommendation
- **SUPPLEMENT:** Stanford recommender / large-scale ML material.
- **REFERENCE:** TensorFlow Recommenders docs when implementing with that stack.
  https://www.tensorflow.org/recommenders
- **DEEP:** recommender-system literature and industry case studies.

## PHASE 19 - DEEP LEARNING
**Concept coverage:** perceptrons, MLPs, activations, loss, backpropagation, optimisers, regularisation, dropout, normalisation, initialisation, failure modes.

- **CORE:** MIT 6.S191 Introduction to Deep Learning
  https://introtodeeplearning.com/
- **PRACTICE / REFERENCE:** PyTorch tutorials
  https://docs.pytorch.org/tutorials/
- **DEEP:** Deep Learning, Goodfellow et al.; Dive into Deep Learning
  https://d2l.ai/
- **IMPLEMENT:** hand-compute a small forward/backprop example, then build the same idea in PyTorch.

## PHASE 20 - COMPUTER VISION
**Concept coverage:** CNNs, convolutions, pooling, augmentation, transfer learning, detection, segmentation, vision transformers awareness.

- **CORE:** Stanford CS231n
  https://cs231n.stanford.edu/
- **REFERENCE:** PyTorch vision tutorials and torchvision docs.
- **DEEP:** modern vision papers once fundamentals are strong.

## PHASE 21 - SEQUENCE MODELS AND NLP
**Concept coverage:** tokenisation concepts, sequence modelling, RNNs, LSTMs/GRUs, language modelling, embeddings, NLP pipelines.

- **CORE:** Stanford CS224N
  https://web.stanford.edu/class/cs224n/
- **REFERENCE:** Hugging Face NLP/Transformers docs.
  https://huggingface.co/docs/transformers/
- **DEEP:** NLP research papers and selected chapters of Speech and Language Processing.

## PHASE 22 - ATTENTION AND TRANSFORMERS
**Concept coverage:** queries/keys/values, self-attention, multi-head attention, masking, positional encoding, encoder/decoder architectures, training objectives.

- **CORE:** Stanford CS224N + Hugging Face course.
  https://web.stanford.edu/class/cs224n/
  https://huggingface.co/docs/course/chapter1/1
- **SUPPLEMENT:** The Illustrated Transformer
  https://jalammar.github.io/illustrated-transformer/
- **REFERENCE:** Transformer implementation/documentation in Hugging Face.
- **IMPLEMENT:** implement a small attention block and a miniature transformer before fine-tuning large models.

## PHASE 23 - MODERN LLM ENGINEERING
**Concept coverage:** tokenisers, embeddings, pretraining concepts, instruction tuning, fine-tuning, LoRA/PEFT, quantisation, inference, model serving, Hugging Face ecosystem.

- **CORE:** Hugging Face Course
  https://huggingface.co/course/
- **REFERENCE:** Transformers, Datasets, Tokenizers, Accelerate docs.
  https://huggingface.co/docs/transformers/
  https://huggingface.co/docs/datasets/
  https://huggingface.co/docs/tokenizers/
  https://huggingface.co/docs/accelerate/
- **DEEP:** Full Stack Deep Learning
  https://fullstackdeeplearning.com/
- **RECHECK:** model-serving and inference libraries change quickly. Read current release docs when implementing.

## PHASE 24 - RETRIEVAL-AUGMENTED GENERATION
**Concept coverage:** ingestion, chunking, embeddings, retrieval, hybrid retrieval, reranking, context construction, citations, freshness, evaluation, failure modes.

- **CORE:** Full Stack Deep Learning material on LLM applications
  https://fullstackdeeplearning.com/
- **REFERENCE:** LlamaIndex docs
  https://docs.llamaindex.ai/
- **SUPPLEMENT:** Haystack docs when a comparison is useful
  https://docs.haystack.deepset.ai/
- **DEEP:** information retrieval fundamentals and vector-search documentation.
- **IMPLEMENT:** a retrieval system with an evaluation set, not a “chat with PDF” demo only.

## PHASE 25 - AI AGENTS
**Concept coverage:** tool use, planning, state, memory, orchestration, structured outputs, failure handling, retries, human-in-the-loop, agent evaluation.

- **CORE:** Hugging Face Agents Course
  https://huggingface.co/learn/agents-course/
- **REFERENCE:** LangGraph documentation when using graph-based orchestration
  https://docs.langchain.com/oss/python/langgraph/
- **SUPPLEMENT:** provider-specific agent SDK documentation when a project calls for it.
- **DEEP:** agent reliability/evaluation research and production case studies.
- **IMPLEMENT:** deterministic tool-use first, then bounded agent loops.

## PHASE 26 - MULTIMODAL AI
**Concept coverage:** vision-language models, image/text alignment, audio/text awareness, multimodal preprocessing, inference pipelines.

- **CORE:** Hugging Face task/model documentation.
  https://huggingface.co/tasks
- **FOUNDATIONS:** CS231n + CS224N.
- **REFERENCE:** PyTorch and Transformers docs.
- **DEEP:** current multimodal model papers.
- **RECHECK:** this is a fast-moving research area; refresh the model/tool section before serious work.

## PHASE 27 - AI EVALUATION
**Concept coverage:** unit evaluation, retrieval evaluation, generation quality, groundedness, safety, regression tests, online monitoring, experiment design.

- **CORE:** NIST AI Risk Management Framework
  https://www.nist.gov/itl/ai-risk-management-framework
- **PRACTICE:** build a labelled evaluation set and regression suite for every serious AI project.
- **REFERENCE:** framework-specific evaluation docs (MLflow, provider APIs, task libraries) for the stack in use.
- **DEEP:** evaluation and measurement papers; benchmark methodology.

## PHASE 28 - ML ENGINEERING
**Concept coverage:** project structure, data validation, reproducibility, experiment tracking, configuration, training pipelines, tests, model lifecycle.

- **CORE:** Made With ML MLOps Course
  https://madewithml.com/courses/mlops/
- **SUPPLEMENT:** Full Stack Deep Learning
  https://fullstackdeeplearning.com/
- **REFERENCE:** MLflow docs
  https://mlflow.org/docs/latest/
- **REFERENCE:** DVC docs
  https://dvc.org/doc
- **DEEP:** Google Rules of ML
  https://developers.google.com/machine-learning/guides/rules-of-ml
- **IMPLEMENT:** train → track → register → serve → monitor → reproduce.

## PHASE 29 - MODEL SERVING
**Concept coverage:** batch vs online inference, APIs, latency, throughput, scaling, model packaging, health checks, canaries, rollback.

- **CORE:** FastAPI for service fundamentals
  https://fastapi.tiangolo.com/tutorial/
- **REFERENCE:** KServe docs for Kubernetes-native serving
  https://kserve.github.io/website/
- **REFERENCE:** vLLM docs for LLM inference
  https://docs.vllm.ai/
- **DEEP:** serving-system papers and performance investigations.
- **IMPLEMENT:** deploy one model behind a versioned API with metrics and a rollback plan.

## PHASE 30 - MLOPS
**Concept coverage:** orchestration, data/model versioning, registries, CI/CD, monitoring, drift, retraining, governance.

- **CORE:** Made With ML
  https://madewithml.com/courses/mlops/
- **REFERENCE:** MLflow
  https://mlflow.org/docs/latest/
- **REFERENCE:** DVC
  https://dvc.org/doc
- **PRACTICE:** GitHub Actions + containerised pipeline.
- **DEEP:** FSDL + production ML case studies.

## PHASE 31 - DEVOPS
**Concept coverage:** containers, Dockerfiles, Compose, registries, CI/CD, secrets, environment management, deployment workflows.

- **CORE:** Docker Get Started
  https://docs.docker.com/get-started/
- **PRACTICE:** GitHub Actions
  https://docs.github.com/en/actions
- **REFERENCE:** Docker docs
  https://docs.docker.com/
- **DEEP:** Kubernetes and cloud architecture only after the fundamentals are real.
- **IMPLEMENT:** containerise a project, test in CI, push an image, deploy it.

## PHASE 32 - CLOUD
**Concept coverage:** compute, networking, storage, IAM, managed databases, queues, serverless awareness, monitoring, cost.

- **CORE:** AWS Skill Builder / cloud fundamentals
  https://skillbuilder.aws/
- **REFERENCE:** AWS documentation
  https://docs.aws.amazon.com/
- **ARCHITECTURE:** AWS Well-Architected Framework
  https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
- **DEEP:** cloud architecture case studies and service-specific documentation.
- **RULE:** learn one cloud deeply enough to deploy; understand the analogous concepts in others.

## PHASE 33 - TERRAFORM / INFRASTRUCTURE AS CODE
**Concept coverage:** providers, resources, variables, modules, state, plan/apply, remote state, drift, environment separation.

- **CORE:** HashiCorp Terraform Tutorials
  https://developer.hashicorp.com/terraform/tutorials
- **REFERENCE:** Terraform docs
  https://developer.hashicorp.com/terraform/docs
- **DEEP:** Terraform internals and cloud-provider-specific patterns when required.
- **IMPLEMENT:** provision the infrastructure for one portfolio system from code.

## PHASE 34 - KUBERNETES
**Concept coverage:** pods, deployments, services, ingress, config, secrets, storage, scheduling, networking, observability, security.

- **CORE:** Kubernetes Concepts and official tutorials
  https://kubernetes.io/docs/concepts/
- **PRACTICE:** Minikube/kind-based local cluster.
- **REFERENCE:** Kubernetes docs
  https://kubernetes.io/docs/home/
- **DEEP:** Kubernetes architecture and scheduler/controller internals.
- **RULE:** Kubernetes stays deferred until Linux, networking, containers, deployment, and debugging are comfortable.

## PHASE 35 - SYSTEM DESIGN
**Concept coverage:** requirements, capacity, data flow, APIs, storage, caching, queues, consistency, partitioning, reliability, tradeoffs, diagrams.

- **CORE:** Designing Data-Intensive Applications
  https://dataintensive.net/
- **PRACTICE:** System Design Primer
  https://github.com/donnemartin/system-design-primer
- **REFERENCE:** AWS Well-Architected Framework
  https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
- **DEEP:** system-specific architecture papers and postmortems.
- **IMPLEMENT:** design the architecture of your own projects before scaling them.

## PHASE 36 - DISTRIBUTED SYSTEMS
**Concept coverage:** RPC, failure, time, replication, consensus, consistency, partitioning, sharding, distributed transactions, fault tolerance.

- **CORE:** MIT 6.5840 Distributed Systems
  https://pdos.csail.mit.edu/6.824/
- **PRACTICE:** labs and paper questions where prerequisites permit.
- **REFERENCE:** Raft resources
  https://raft.github.io/
- **DEEP:** Distributed Systems, Tanenbaum/van Steen or equivalent; original papers.
- **IMPLEMENT:** replicated key-value store or selected distributed-systems lab.

## PHASE 37 - ML SYSTEM DESIGN
**Concept coverage:** data pipelines, feature generation, training/serving split, batch/online inference, experimentation, monitoring, privacy, reliability.

- **CORE:** Stanford CS329S Machine Learning Systems Design
  https://web.stanford.edu/class/cs329s/
- **DEEP:** Designing Machine Learning Systems, Chip Huyen
  https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/
- **REFERENCE:** cloud and serving documentation for the deployed architecture.
- **IMPLEMENT:** design and defend a complete ML system from product requirement to monitoring.

## PHASE 38 - OBSERVABILITY
**Concept coverage:** metrics, logs, traces, instrumentation, SLOs, alerting, debugging production behavior.

- **CORE:** OpenTelemetry docs
  https://opentelemetry.io/docs/
- **REFERENCE:** Prometheus docs
  https://prometheus.io/docs/
- **REFERENCE:** Grafana docs
  https://grafana.com/docs/
- **DEEP:** Site Reliability Engineering
  https://sre.google/sre-book/table-of-contents/
- **IMPLEMENT:** instrument one service and trace a request across components.

## PHASE 39 - SECURITY
**Concept coverage:** authentication, authorisation, input validation, secrets, injection, SSRF, XSS, CSRF, supply chain, threat modelling, AI-specific attacks.

- **CORE:** PortSwigger Web Security Academy
  https://portswigger.net/web-security
- **REFERENCE:** OWASP Top 10
  https://owasp.org/www-project-top-ten/
- **AI SECURITY REFERENCE:** OWASP GenAI Security Project
  https://genai.owasp.org/
- **STANDARDS:** NIST AI RMF
  https://www.nist.gov/itl/ai-risk-management-framework
- **DEEP:** threat-modeling literature and security advisories for the systems actually deployed.

## PHASE 40 - RESEARCH SKILLS
**Concept coverage:** reading papers, literature review, hypothesis, experiment design, reproduction, ablation, benchmarking, scientific writing.

- **CORE:** papers from NeurIPS, ICML, ICLR, ACL, CVPR, MLSys, etc.
- **DISCOVERY:** arXiv
  https://arxiv.org/
- **SUPPLEMENT:** Papers with Code / benchmark repositories where still relevant.
  https://paperswithcode.com/
- **DEEP:** original papers, official code repositories, supplementary material.
- **IMPLEMENT:** reproduce one paper before attempting original research.

## PHASE 41 - REINFORCEMENT LEARNING
**Concept coverage:** MDPs, value functions, Bellman equations, dynamic programming, Monte Carlo, TD learning, Q-learning, policy gradients, actor-critic awareness.

- **CORE:** Reinforcement Learning: An Introduction, Sutton and Barto
  http://incompleteideas.net/book/the-book-2nd.html
- **SUPPLEMENT:** David Silver reinforcement learning lectures
  https://www.davidsilver.uk/teaching/
- **REFERENCE:** Gymnasium docs when implementing environments
  https://gymnasium.farama.org/
- **DEEP:** current RL papers once mathematics and deep learning foundations are strong.

## PHASE 42 - ADVANCED ML SYSTEM TOPICS
**Concept coverage:** feature stores, distributed training, model parallelism, inference optimisation, batching, accelerator utilisation.

- **CORE:** PyTorch Distributed documentation
  https://docs.pytorch.org/docs/stable/distributed.html
- **REFERENCE:** Ray docs
  https://docs.ray.io/
- **REFERENCE:** DeepSpeed docs
  https://www.deepspeed.ai/
- **REFERENCE:** vLLM docs
  https://docs.vllm.ai/
- **DEEP:** systems papers, benchmark reports, accelerator architecture material.

## PHASE 43 - DATA / ML INFRASTRUCTURE
**Concept coverage:** Kafka, Spark, Airflow, feature stores, distributed ETL, online/offline feature serving.

- **CORE:** Data Engineering Zoomcamp
  https://datatalks.club/blog/data-engineering-zoomcamp.html
- **REFERENCE:** Kafka
  https://kafka.apache.org/documentation/
- **REFERENCE:** Spark
  https://spark.apache.org/documentation/
- **REFERENCE:** Airflow
  https://airflow.apache.org/docs/
- **REFERENCE:** Feast
  https://docs.feast.dev/
- **IMPLEMENT:** streaming pipeline + batch pipeline + feature serving comparison.

## PHASE 44 - AI ENGINEERING AS A SYSTEMS DISCIPLINE
**Concept coverage:** model choice, prompting, structured outputs, tool use, RAG, agents, serving, evaluation, reliability, security, cost, observability.

- **CORE:** Full Stack Deep Learning
  https://fullstackdeeplearning.com/
- **ECOSYSTEM REFERENCE:** Hugging Face docs/course
  https://huggingface.co/docs
- **IMPLEMENTATION REFERENCE:** provider/model/framework docs specific to the current architecture.
- **DEEP:** production case studies, evaluation papers, serving-system documentation.
- **RULE:** architecture and evaluation outrank prompt cleverness.

## PHASE 45 - COST ENGINEERING
**Concept coverage:** unit economics, token/GPU/CPU costs, storage, network costs, caching, batching, model choice, capacity planning.

- **CORE:** cloud provider pricing documentation (start with AWS)
  https://aws.amazon.com/pricing/
- **ARCHITECTURE:** AWS Well-Architected cost optimisation pillar
  https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/
- **DEEP:** FinOps Foundation
  https://www.finops.org/framework/
- **IMPLEMENT:** add cost estimates and a cost-per-request measure to a deployed system.

## PHASE 46 - PRODUCT THINKING FOR ENGINEERS
**Concept coverage:** user problem, requirements, tradeoffs, metrics, MVP thinking, iteration, feedback, technical prioritisation.

- **CORE:** product discovery through real project users and stakeholders.
- **SUPPLEMENT:** Inspired, The Mom Test, and strong product requirement examples.
- **REFERENCE:** your project's issue tracker, design docs, analytics, user interviews.
- **IMPLEMENT:** write a one-page problem statement, success metric, constraints, and feedback plan before a significant build.

---

# 76.5 TOOL / LANGUAGE RESOURCE REGISTRY

This registry prevents “technology named in the roadmap but never routed to a resource.”

| Technology / tool | Activation | Primary route | Official reference |
|---|---|---|---|
| Python | Phase 1 | CS50P | https://docs.python.org/3/ |
| Java | Phase 1/7 support | dev.java + university work | https://dev.java/learn/ |
| JavaScript | Phase 7 onward | Odin / MDN | https://developer.mozilla.org/en-US/docs/Web/JavaScript |
| TypeScript | Phase 7 onward | Odin + TS Handbook | https://www.typescriptlang.org/docs/handbook/ |
| SQL | Phase 6 | SQLBolt + CMU | https://www.postgresql.org/docs/current/ |
| PostgreSQL | Phase 6 | CMU DB course | https://www.postgresql.org/docs/current/ |
| Redis | Phase 6/8 | project use + docs | https://redis.io/docs/latest/ |
| MongoDB | Optional | docs + targeted tutorial | https://www.mongodb.com/docs/ |
| Git | Phase 2 | Pro Git | https://git-scm.com/docs |
| GitHub | Phase 2 | GitHub Skills | https://docs.github.com/ |
| Linux | Phase 3 | Missing Semester | https://missing.csail.mit.edu/ |
| Bash | Phase 3 | Missing Semester | shell manuals |
| Docker | Phase 31 | Docker Get Started | https://docs.docker.com/ |
| GitHub Actions | Phase 31 | GitHub Actions docs | https://docs.github.com/en/actions |
| Terraform | Phase 33 | HashiCorp tutorials | https://developer.hashicorp.com/terraform/docs |
| Kubernetes | Phase 34 | Kubernetes docs | https://kubernetes.io/docs/ |
| NumPy | Phase 11+ | NumPy docs | https://numpy.org/doc/ |
| Pandas | Phase 11+ | Pandas docs | https://pandas.pydata.org/docs/ |
| Matplotlib | Phase 11+ | Matplotlib docs | https://matplotlib.org/stable/ |
| scikit-learn | Phase 13+ | ISLR + User Guide | https://scikit-learn.org/stable/user_guide.html |
| PyTorch | Phase 19+ | MIT 6.S191 + tutorials | https://docs.pytorch.org/ |
| Hugging Face Transformers | Phase 22+ | HF Course | https://huggingface.co/docs/transformers/ |
| Datasets | Phase 23+ | HF Course | https://huggingface.co/docs/datasets/ |
| Tokenizers | Phase 23+ | HF Course | https://huggingface.co/docs/tokenizers/ |
| Accelerate | Phase 23+ | HF Course | https://huggingface.co/docs/accelerate/ |
| FastAPI | Phase 8/29 | FastAPI tutorial | https://fastapi.tiangolo.com/ |
| Spring Boot | Optional Java backend | Spring official docs | https://spring.io/projects/spring-boot |
| MLflow | Phase 28/30 | Made With ML + MLflow docs | https://mlflow.org/docs/latest/ |
| DVC | Phase 28/30 | Made With ML + DVC docs | https://dvc.org/doc |
| Airflow | Phase 12/43 | Zoomcamp | https://airflow.apache.org/docs/ |
| Kafka | Phase 12/43 | Zoomcamp | https://kafka.apache.org/documentation/ |
| Spark | Phase 12/43 | Zoomcamp | https://spark.apache.org/documentation/ |
| Feast | Phase 43 | Feature store docs | https://docs.feast.dev/ |
| OpenTelemetry | Phase 38 | Official docs | https://opentelemetry.io/docs/ |
| Prometheus | Phase 38 | Official docs | https://prometheus.io/docs/ |
| Grafana | Phase 38 | Official docs | https://grafana.com/docs/ |
| vLLM | Phase 23/29/42 | official docs | https://docs.vllm.ai/ |
| KServe | Phase 29 | official docs | https://kserve.github.io/website/ |
| Ray | Phase 42 | official docs | https://docs.ray.io/ |
| DeepSpeed | Phase 42 | official docs | https://www.deepspeed.ai/ |
| LlamaIndex | Phase 24 | official docs | https://docs.llamaindex.ai/ |
| LangGraph | Phase 25 | official docs | https://docs.langchain.com/oss/python/langgraph/ |
| Gymnasium | Phase 41 | official docs | https://gymnasium.farama.org/ |

---

# 76.6 RESOURCE RULES FOR FAST-MOVING AI STACKS

AI tooling changes faster than core CS material. Therefore:

- learn durable concepts first;
- use official documentation for exact APIs and supported versions;
- pin dependencies in projects;
- record the version used in README/setup files;
- treat framework-specific tutorials as disposable implementation knowledge;
- recheck model libraries, agent frameworks, serving systems, and evaluation tooling when you activate the phase rather than assuming a 2026 link remains current forever.

For fast-moving AI tools, **the concept survives longer than the interface**.

# 76.7 WHAT TO DO WHEN A RESOURCE DISAPPEARS

Do not let a broken link derail the curriculum.

```text
Broken resource
    ↓
Official replacement / current version
    ↓
Equivalent university course or textbook
    ↓
Practice + implementation
    ↓
Continue
```

The roadmap's competency gate is the invariant. The URL is not.

# 77. RESOURCE OPERATING RULES

## 77.1 One active source

Choose one primary learning source for the current phase. Two is acceptable when the subject genuinely needs two complementary modes, such as a theory course plus a coding environment.

## 77.2 Documentation is not “advanced-only”

Read official docs immediately for small lookups. Do not try to learn an entire ecosystem from reference documentation on Day 1. As competence increases, deliberately shift more of your learning load toward documentation.

## 77.3 Practice must be independent

A resource has failed its purpose when you can follow it but cannot reproduce the skill elsewhere. Practice must contain unseen tasks.

## 77.4 Resource hoarding is a warning sign

When you have three tabs open for competing courses on the same concept, close two. A small amount of friction is better than endless comparison.

## 77.5 Resource reviews

At every major phase boundary, record:

- primary resource used;
- practice source used;
- official reference;
- what the resource explained poorly;
- what was missing;
- what replaced it, if anything;
- version/date for fast-moving tools.

This turns the roadmap into a maintained learning system instead of a static document.

# 78. UNIVERSITY INTEGRATION

The degree should reinforce the roadmap, not compete with it.

## Mathematics courses

Map to:

- ML mathematics
- optimisation
- statistics

## Statistics

Map to:

- experimentation
- model evaluation
- uncertainty

## Programming

Map to:

- software engineering
- DSA
- backend

## Databases

Map to:

- backend
- analytics
- ML infrastructure

## Research/course projects

Map to:

- research
- technical writing
- portfolio

Whenever a university course overlaps with a roadmap topic, use the university course for academic requirements and the roadmap for deliberate reconstruction, additional practice, and mastery checks. Do not assume that seeing a topic in class means the practical foundation is secure.

---

# 79. YEAR-BY-YEAR MASTER TIMELINE

This timeline is **stage-based, not deadline-based**. A stage can spill into the next academic year. The objective is durable competency, not finishing a checklist on a date.

# 2026-2027 - FOUNDATION RESET YEAR

### Stage 0 - Programming reset

Primary:
- Python fundamentals
- control flow
- functions
- collections
- files
- exceptions

Exit only after the programming foundation gate.

### Stage 1 - Tooling and programming fluency

- Git/GitHub
- CLI/Linux basics
- Python beyond the basics
- testing and debugging
- small projects

### Stage 2 - First CS/data foundations

Only after Stage 1 is reliable:
- DSA fundamentals
- SQL fundamentals
- basic PostgreSQL

### Stage 3 - Mathematical/data foundations

- statistics
- probability
- linear algebra
- NumPy/Pandas
- EDA

### Stage 4 - Engineering foundation

- software engineering basics
- backend fundamentals
- APIs

Classical ML may begin only when the programming, data, and statistics gates are genuinely passing.

**Important:** this year does not require reaching deep ML, deep learning, Kubernetes, or LLM systems. If foundation repair takes longer, let it take longer.

# 2027-2028 - ENGINEERING + CLASSICAL ML

Only enter this year-level emphasis after the relevant foundation gates have passed.

Progress through:

- DSA depth
- SQL/PostgreSQL
- backend engineering
- networking
- operating systems
- software architecture
- classical ML
- model evaluation
- Docker
- CI/CD
- cloud foundations
- system design fundamentals

# 2028-2029 - DEEP LEARNING + ML ENGINEERING

Only enter this emphasis after strong classical ML and software-engineering foundations.

- PyTorch
- neural networks
- CNNs / sequence models
- attention / Transformers
- ML engineering
- model serving
- MLOps
- cloud
- research reproduction

# 2029-2030 - AI ENGINEERING + ML SYSTEMS

Only enter this emphasis after the ML engineering and deployment gates.

- LLM engineering
- RAG
- agents
- AI evaluation
- AI security
- system design
- ML system design
- distributed systems
- production inference

# 2030+ - SPECIALISATION

Select one primary specialist direction after evidence accumulates. Candidate directions:

- ML Systems / MLOps / Infrastructure
- LLM / AI Engineering
- Research Engineering / Applied Science

Other branches remain available when a concrete need or opportunity justifies them.

# 80. SEMESTER-LEVEL OPERATING MODEL

The semester model is now explicitly workload-aware.

## Normal semester

- university work
- one primary roadmap module
- DSA maintenance after the programming gate
- one project milestone

## Heavy semester

When the heavy-semester trigger is active:

- university becomes dominant
- no requirement to complete a new roadmap module
- DSA becomes maintenance only, after the programming gate
- project work becomes maintenance only

## Exams

- university only
- optional light DSA
- no new roadmap branch

## Internship / SIWES

- use overlapping work as applied learning
- maintain only the minimum independent study needed to avoid losing the active skill
- do not run a second full curriculum in parallel

## Break / holiday

- return to one primary module
- add a serious project milestone
- increase DSA practice
- use the extra capacity for deeper implementation

# 81. WEEKLY EXECUTION MODEL

A realistic baseline is more useful than an heroic schedule.

### Beginner reset

Most external study time should go into the primary programming block. Do not force DSA, ML, mathematics, projects, and cloud into the same week.

### After the programming gate

A typical allocation can become:

- **40-50%** primary subject
- **20-25%** DSA
- **15-20%** project/engineering
- **10-15%** mathematics, statistics, or review

These percentages only apply when capacity exists. University and internship obligations override them.

# 82. SAMPLE WEEK

```text
MONDAY
Primary subject
DSA

TUESDAY
Math/statistics
Project

WEDNESDAY
Primary subject
DSA

THURSDAY
University focus
Engineering practice

FRIDAY
Primary subject
DSA

SATURDAY
Long project session
Research/reading

SUNDAY
Review
Planning
Light practice
```

The exact schedule should change with university demands.

---

# 83. DAILY WORK UNIT

For a beginner, a useful session is:

```text
10 min - recall
30-45 min - learn one small concept
30-45 min - write code yourself
10-15 min - debug / test
5-10 min - explain from memory
5 min - record the next step
```

The exact duration can shrink on busy days. The important property is that **active coding happens during the session**.

# 84. MONTHLY REVIEW

At the end of each month answer:

### Knowledge

- What can I explain now that I could not explain before?

### Implementation

- What can I build now?

### Problem solving

- Which DSA patterns improved?

### Projects

- What did I ship?

### Weaknesses

- Where did I get stuck repeatedly?

### Roadmap

- Is the sequence still sensible?

### Career

- Did I create evidence of capability?

Do not restart the roadmap every month.

Adjust the active path, not the entire architecture.

---

# 85. COMPETENCY CHECKPOINTS

## Checkpoint 1 - Programmer

Pass when you can:

- write small Python programs without tutorials
- use `for` and `while` loops correctly
- write and call functions
- use lists and dictionaries naturally
- read/write simple files
- handle common exceptions
- debug a small program
- make meaningful Git commits

### Practical gate

Complete 3 unseen beginner programming tasks in separate sessions with at most normal documentation lookup, and build one small CLI program without following a walkthrough. Do the unseen tasks with AI assistance off (Assess mode, section 109).

## Checkpoint 2 - CS foundation

Pass when you can:

- implement common data structures
- analyse basic time/space complexity
- solve standard beginner/intermediate DSA problems
- explain core OS, networking, and database concepts

### Practical gate

Complete a mixed set of unseen DSA problems with at least 80% correctness over repeated attempts, explain the complexity of each solution, and implement the core structures yourself. AI assistance stays off for these problems (Assess mode, section 109).

## Checkpoint 3 - Backend engineer

Pass when you can:

- build an authenticated API
- use PostgreSQL
- validate input
- write tests
- handle errors
- document an API
- deploy an application
- work in an unfamiliar codebase with an AI assistant: fix a bug and add a small feature, explain every accepted change, and name at least one AI mistake you caught
- run a coding agent on your own service with least privilege (a branch, no production credentials, reviewed commands) and describe exactly what it could access

### Practical gate

Ship one small service with authentication, persistence, tests, API documentation, and a real deployment.

## Checkpoint 4 - Data scientist

Pass when you can:

- clean messy data
- perform EDA
- write SQL
- formulate statistical questions
- use uncertainty correctly
- build appropriate baselines/models
- evaluate them correctly
- communicate findings

### Practical gate

Take an unfamiliar dataset, produce a reproducible analysis, answer at least five defensible questions, and explain the limitations of the conclusions.

## Checkpoint 5 - ML engineer

Pass when you can:

- build an ML training pipeline
- version data/model/code sensibly
- package a model
- serve it
- test it
- monitor key signals
- diagnose a failure

### Practical gate

Ship one end-to-end ML service from data ingestion through inference and monitoring.

## Checkpoint 6 - AI engineer

Pass when you can:

- build LLM applications
- implement RAG
- use tools safely
- evaluate retrieval and generation
- handle failures and cost constraints
- include indirect prompt-injection cases (instructions hidden in retrieved content or tool output) in the evaluation set

### Practical gate

Build an evaluated AI system with a documented evaluation set, retrieval or tool-use tests, failure analysis, and basic observability.

## Checkpoint 7 - top-tier candidate

Pass when you can:

- solve DSA problems under time pressure
- explain CS fundamentals clearly
- design systems
- explain serious projects deeply
- communicate trade-offs
- provide genuine behavioural evidence
- complete a timed AI-assisted code-comprehension session on an unfamiliar multi-file repository, and a timed AI-free DSA session, in the same week

Interview readiness is a separate performance skill and must be trained deliberately near recruiting periods.

# 86. DEPTH BENCHMARKS BY CAREER LEVEL

## Beginner

- D0–D1 breadth
- D1–D2 in primary language

## Internship-ready

- D2 in core practical tools
- D2–D3 in DSA basics
- strong project evidence

## Junior / new-grad ready

- D2–D3 across primary stack
- D3 in DSA/problem solving
- D2–D3 CS fundamentals
- meaningful projects/internship evidence

## Strong engineer

- D3–D4 in chosen core
- D3 systems understanding
- D3 production habits

## Advanced engineer

- D4 in specialization
- D4 system-level reasoning
- strong architectural judgement

## Research/specialist

- D5 in selected area
- strong literature and experimental ability

---

# 86.1 FOUNDATION FAILURE RECOVERY

When a re-test shows a foundational gap, do not restart the entire roadmap.

Use this recovery loop:

```text
Identify exact broken capability
        ↓
Return to the smallest prerequisite
        ↓
Do 3-5 targeted exercises
        ↓
Build one tiny artifact
        ↓
Re-test from memory
        ↓
Return to the active phase
```

The objective is targeted repair, not repeated full-course resets.

# 87. SPECIALISATION STRATEGY

The master roadmap preserves seven specialist branches for reference. **Do not treat all seven as simultaneous career targets.**

For the early-to-mid roadmap, keep three candidate directions visible:

1. **ML Systems / MLOps / Infrastructure**
2. **LLM / AI Engineering**
3. **Research Engineering / Applied Science**

These share a large common foundation with the main trajectory.

Computer Vision, NLP/Information Retrieval, and Data/ML Infrastructure remain valid branches inside the map, but activate them only when coursework, projects, internships, research, or sustained interest provide evidence that they deserve dedicated time.

## 87.1 Branch A - ML Systems

Prioritise:

- model serving
- distributed training
- inference optimisation
- feature systems
- data pipelines
- storage
- schedulers
- observability
- performance engineering

## 87.2 Branch B - LLM / AI Engineering

Prioritise:

- Transformers
- inference
- fine-tuning
- RAG
- agents
- evaluation
- AI security
- model routing
- serving
- multimodal systems

## 87.3 Branch C - Research Engineering / Applied Science

Prioritise:

- mathematics
- statistics
- PyTorch
- papers
- experimental design
- benchmarking
- reproducibility
- research infrastructure

## 87.4 Reference Branches - Activate Only When Evidence Appears

### Computer Vision

- CNNs
- vision transformers
- detection
- segmentation
- multimodal models
- image/video pipelines

### NLP / Information Retrieval

- language modelling
- Transformers
- information retrieval
- ranking
- embeddings
- RAG
- evaluation

### Data / ML Infrastructure

- data pipelines
- distributed processing
- orchestration
- feature systems
- model infrastructure
- cloud

The point is not to delete these branches. The point is to stop them from stealing time from the common foundation before there is a reason to choose them.

# 88. RESOURCE MAINTENANCE AND CHANGE CONTROL

This roadmap is long-lived. Its concepts should be stable even when its tools change.

### Stable layer

These are revalidated infrequently:

- programming fundamentals
- algorithms
- operating systems
- networking fundamentals
- databases
- mathematics
- probability/statistics
- classical ML
- core deep learning
- distributed-systems principles

### Fast-changing layer

Recheck at activation:

- cloud service details
- Kubernetes ecosystem tools
- model-serving libraries
- LLM APIs
- agent frameworks
- evaluation libraries
- multimodal model tooling
- model names and benchmark leaderboards

### Maintenance rule

When a current tool changes, replace the implementation resource, not the underlying competency.

---

# 89. EXECUTION LOG

Every active roadmap module should produce a tiny evidence record.

```text
DATE:
PHASE:
PRIMARY RESOURCE:
CONCEPTS STUDIED:
WHAT I CAN DO WITHOUT HELP:
WHAT I STILL CANNOT DO:
ARTIFACT:
PROBLEMS / EXERCISES:
BUG OR FAILURE:
FIX:
NEXT RETEST DATE:
```

The goal is to make learning observable.

---

# 90. ENGINEERING ENVIRONMENT STANDARD

Do not waste months rebuilding your setup.

### Baseline

- VS Code or another dependable editor
- terminal
- Git/GitHub
- Python
- virtual environments / modern package management
- browser with developer tools
- Markdown notes
- a way to run tests locally

### Later

- Docker
- cloud account when required
- infrastructure tooling
- observability stack
- GPU environment when required

### Rule

Tooling exists to remove friction from building. It is not itself the project unless the project is about tooling.

---

# 91. AI-ASSISTED LEARNING RULES

Coding agents and AI assistants are part of the modern engineering environment, but they do not replace foundational reasoning.

### Allowed use

- explain an error after you attempt to diagnose it;
- give hints rather than full solutions;
- review your code for defects or tradeoffs;
- help you compare documentation or approaches;
- generate test cases after you understand the specification;
- help explore unfamiliar APIs once you know the underlying concept.

### Restricted use

Do not use AI to outsource:

- beginner programming exercises you are supposed to internalise;
- DSA interviews or timed assessments;
- university assignments when prohibited;
- internship tasks when the organisation restricts it;
- paper-reproduction code you have not attempted yourself.

### Best pattern

```text
Think
→ attempt
→ diagnose
→ consult AI/docs
→ fix
→ explain
→ retest
```

The objective is **AI-accelerated learning**, not AI-dependent learning.

These rules are the Learn mode of the AI-native engineering overlay. Section 109 adds the Build and Assess modes, the three AI tiers, and the AI missions.

---

# 92. FEEDBACK AND EXPOSURE LOOP

You can build privately, but you cannot validate everything privately.

For every meaningful project, seek feedback from relevant people:

- classmates who understand the domain;
- stronger engineers;
- mentors or supervisors;
- users or stakeholders;
- maintainers when contributing to open source.

Use feedback to test:

- problem relevance;
- clarity;
- usability;
- architecture;
- code quality;
- technical assumptions;
- documentation.

The rule is simple:

> **Build quietly when quiet work helps concentration. Expose the work when exposure can produce better evidence.**

Do not confuse public visibility with validation. Relevant criticism is more valuable than attention.

---

# 93. KNOWLEDGE BASE STANDARD

Maintain one durable knowledge base alongside the roadmap.

Each major subject gets:

1. **Concept page** - what it is.
2. **Mechanism page** - how it works.
3. **Implementation page** - code/lab.
4. **Failure page** - common bugs and misconceptions.
5. **Reference page** - official links/specs.
6. **Project page** - where you used it.
7. **Retest page** - questions/problems you must still be able to solve.

Prefer short, high-signal notes over transcripts of courses.

# 94. RESEARCH AND POSTGRADUATE PREPARATION

If advanced study remains a priority:

Build evidence in:

- strong mathematics
- strong statistics
- research projects
- paper reproduction
- technical writing
- recommendation-quality relationships with faculty/supervisors
- research internships where available

Potential long-term options previously considered include highly selective international postgraduate programmes, but the specific final institution should remain open until later evidence and opportunities make the decision more concrete.

---

# 95. TOP-TIER CAREER READINESS CHECKLIST

Before serious elite-company recruiting, aim to have evidence that you can:

### Coding

- solve arrays/strings problems
- hash
- trees
- graphs
- recursion
- backtracking
- DP
- analyse complexity

### CS

- explain process vs thread
- explain virtual memory
- explain TCP vs UDP
- explain DNS/HTTP/TLS
- explain indexes/transactions
- explain caching/queues

### Systems

- design a service
- scale it
- reason about failure
- explain consistency trade-offs

### ML

- formulate a problem
- establish a baseline
- choose metrics
- avoid leakage
- explain model failures

### ML systems

- train
- serve
- monitor
- version
- retrain

### AI

- build RAG
- evaluate retrieval
- evaluate generation
- secure tool use

### Career

- explain projects deeply
- communicate clearly
- tell genuine behavioural stories

---

# 96. PORTFOLIO PROJECT RUBRIC

For every major project score yourself conceptually on:

## Problem quality

Is it a real problem or a tutorial exercise?

## Technical depth

Did you solve something non-trivial?

## Engineering quality

Is the implementation maintainable?

## Testing

Did you verify behaviour?

## Deployment

Can someone actually run it?

## Observability

Can you see when it breaks?

## Explanation

Can you explain why you built it this way?

## Originality

Did you make meaningful engineering decisions?

---

# 97. THE "BUILD, DON'T JUST LEARN" RULE

For every major domain, create at least one artifact.

## Programming

A working package/application.

## DSA

Implementations + solved problems.

## Databases

Schema + optimised queries.

## Backend

Deployed API.

## Statistics

Analysis report.

## Classical ML

Reproducible experiment.

## Deep learning

Trained model + analysis.

## MLOps

End-to-end deployment pipeline.

## AI engineering

Evaluated AI system.

## Research

Reproduction report.

---

# 98. FAILURE AS PART OF THE CURRICULUM

A strong engineer should deliberately encounter failure.

For projects, record:

- bug encountered
- first hypothesis
- wrong hypothesis
- root cause
- fix
- regression test
- lesson

For ML:

- model failure
- data problem
- leakage discovered
- bad metric
- distribution shift

For systems:

- timeout
- dependency failure
- resource exhaustion
- concurrency bug

The objective is not an unrealistic record of perfect success.

---

# 99. REALISTIC EXPECTATIONS

This roadmap spans years.

You do not need to be good at everything at once.

The purpose of the wide map is to preserve direction.

The purpose of the narrow active path is to preserve execution.

The correct question is rarely:

> “How do I finish the roadmap?”

It is:

> “What capability am I building now, and what does it unlock?”

---

# 100. TEN-YEAR COMPOUNDING PRINCIPLE

The most valuable skills are likely to remain useful even as tools change:

- programming
- abstraction
- algorithms
- statistics
- probability
- linear algebra
- optimisation
- systems thinking
- debugging
- experimentation
- software architecture
- communication

Frameworks will change.

Cloud products will change.

Model families will change.

AI interfaces will change.

The foundation compounds.

---

# 101. MASTER LEARNING SEQUENCE

The practical sequence is:

```text
01. Programming fundamentals
02. Python
03. Git + GitHub
04. Linux / CLI
05. OOP + software engineering basics
06. DSA
07. SQL
08. PostgreSQL
09. Statistics + Probability
10. Linear Algebra
11. NumPy + Pandas
12. EDA
13. Backend + APIs
14. Testing
15. Networking
16. Operating Systems
17. Classical ML
18. ML theory + evaluation
19. Calculus + optimisation
20. Docker
21. CI/CD
22. Software architecture
23. Cloud fundamentals
24. Model serving
25. PyTorch
26. Deep Learning
27. CNNs / sequence models
28. Attention
29. Transformers
30. ML Engineering
31. MLOps
32. System Design
33. Distributed Systems
34. LLM Engineering
35. RAG
36. AI Agents
37. AI Evaluation
38. Advanced ML Systems
39. ML System Design
40. Research / Specialisation
```

This is a dependency-aware default sequence, not a rigid law.

Some branches can run in parallel.

---

# 102. THE PARALLEL TRACKS THAT NEVER FULLY STOP

Even when the primary topic changes, keep some amount of:

### DSA

for algorithmic thinking and interviews.

### Projects

for integration.

### GitHub

for evidence and engineering habits.

### Technical writing

for communication and precision.

### Research

later, at increasing depth.

### Career preparation

internships, portfolio, applications, interviews.

---

# 103. IMMEDIATE FOUNDATIONAL BLOCK

The phrase “immediate foundation” refers to the dependency spine, **not** eight simultaneous active study blocks.

## The dependency spine

```text
Python
  ↓
Git + Linux / CLI
  ↓
DSA + SQL
  ↓
Statistics / Probability + Linear Algebra
  ↓
NumPy / Pandas + EDA
  ↓
Software Engineering + Backend
  ↓
Classical ML
  ↓
Docker / CI/CD / Cloud
  ↓
Deep Learning
  ↓
ML Engineering / MLOps
  ↓
Transformers / LLMs / AI Engineering
```

## The actual active rule

At any moment, only the earliest **unlocked** block becomes NOW.

For your present reset:

```text
NOW   = Python
NEXT  = Git + Linux / CLI
LATER = everything after that
```

The active block advances only after its practical gate is passed.

---

# 104. MASTER MILESTONE DEFINITIONS

## Milestone A - Can code

You can produce working software independently.

## Milestone B - Can engineer

You can structure, test, debug, document, and maintain it.

## Milestone C - Can analyse

You can work with data and uncertainty.

## Milestone D - Can model

You can build and evaluate ML systems correctly.

## Milestone E - Can deploy

You can put models into production-oriented services.

## Milestone F - Can scale

You can reason about systems under load.

## Milestone G - Can research

You can read, reproduce, evaluate, and modify technical work.

## Milestone H - Can interview

You can demonstrate the above under technical evaluation.

---

# 105. MASTER SKILL TREE

```text
MASTER ENGINEER
│
├── PROGRAMMING
│   ├── Python
│   │   ├── Syntax
│   │   ├── Data Structures
│   │   ├── Functions
│   │   ├── OOP
│   │   ├── Typing
│   │   ├── Packaging
│   │   ├── Testing
│   │   └── Internals
│   ├── Java
│   └── TypeScript/JavaScript
│
├── COMPUTER SCIENCE
│   ├── DSA
│   ├── Algorithms
│   ├── Complexity
│   ├── Operating Systems
│   ├── Networking
│   ├── Architecture
│   ├── Compilers
│   ├── Databases
│   ├── Concurrency
│   └── Distributed Systems
│
├── SOFTWARE ENGINEERING
│   ├── Clean Code
│   ├── Testing
│   ├── Debugging
│   ├── Git
│   ├── APIs
│   ├── Architecture
│   ├── Design Patterns
│   └── Security
│
├── BACKEND
│   ├── HTTP
│   ├── REST
│   ├── Auth
│   ├── PostgreSQL
│   ├── Redis
│   ├── Queues
│   ├── Async Processing
│   └── Observability
│
├── MATHEMATICS
│   ├── Linear Algebra
│   ├── Calculus
│   ├── Probability
│   ├── Statistics
│   └── Optimisation
│
├── DATA
│   ├── SQL
│   ├── NumPy
│   ├── Pandas
│   ├── EDA
│   ├── ETL
│   ├── Data Quality
│   └── Experimentation
│
├── MACHINE LEARNING
│   ├── Regression
│   ├── Classification
│   ├── Trees
│   ├── Boosting
│   ├── Clustering
│   ├── PCA
│   ├── Feature Engineering
│   ├── Evaluation
│   └── ML Theory
│
├── DEEP LEARNING
│   ├── Neural Networks
│   ├── Optimisation
│   ├── CNNs
│   ├── Sequence Models
│   ├── Attention
│   └── Transformers
│
├── ML ENGINEERING
│   ├── Data Validation
│   ├── Training
│   ├── Experiment Tracking
│   ├── Model Registry
│   ├── Serving
│   ├── Monitoring
│   └── Retraining
│
├── DEVOPS / CLOUD
│   ├── Linux
│   ├── Docker
│   ├── CI/CD
│   ├── Cloud
│   ├── Terraform
│   └── Kubernetes
│
├── AI ENGINEERING
│   ├── LLMs
│   ├── Embeddings
│   ├── Fine-tuning
│   ├── Quantisation
│   ├── RAG
│   ├── Agents
│   ├── Multimodal AI
│   └── Evaluation
│
├── ML SYSTEMS
│   ├── Recommenders
│   ├── Search
│   ├── Fraud Detection
│   ├── Ranking
│   ├── Serving
│   └── Infrastructure
│
├── RESEARCH
│   ├── Papers
│   ├── Reproduction
│   ├── Experiments
│   ├── Ablations
│   ├── Benchmarking
│   └── Writing
│
└── ELITE CAREER
    ├── DSA Interviews
    ├── CS Interviews
    ├── System Design
    ├── ML System Design
    ├── Behavioural
    ├── Resume
    ├── Internships
    ├── Open Source
    └── Recruiting
```

---

# 106. FINAL "AM I READY?" CHECKLIST

## Software

- [ ] I can write medium-sized programs without tutorials.
- [ ] I can structure a project.
- [ ] I can write tests.
- [ ] I can debug independently.
- [ ] I understand Git.

## CS

- [ ] I understand common DSA patterns.
- [ ] I can analyse complexity.
- [ ] I can discuss OS fundamentals.
- [ ] I can explain networking fundamentals.
- [ ] I can explain database fundamentals.

## Data

- [ ] I can write advanced SQL queries.
- [ ] I can inspect messy datasets.
- [ ] I understand statistics.
- [ ] I can communicate analytical findings.

## ML

- [ ] I can formulate an ML problem.
- [ ] I can establish a baseline.
- [ ] I can avoid common leakage mistakes.
- [ ] I can choose appropriate metrics.
- [ ] I can explain model failures.

## Deep learning

- [ ] I can explain backpropagation.
- [ ] I can build a neural network.
- [ ] I understand optimisation.
- [ ] I understand attention.
- [ ] I understand Transformers.

## Production

- [ ] I can containerise a service.
- [ ] I can create a CI pipeline.
- [ ] I can deploy an application.
- [ ] I can monitor it.
- [ ] I can reason about scale and failure.

## AI

- [ ] I can build RAG.
- [ ] I can evaluate retrieval.
- [ ] I can evaluate generation.
- [ ] I can design tool use safely.
- [ ] I understand AI system trade-offs.

## Career

- [ ] I can solve interview problems under time pressure.
- [ ] I can explain my projects deeply.
- [ ] I can discuss system design.
- [ ] I can discuss ML system design.
- [ ] I have genuine behavioural stories.

---

# 107. FINAL OPERATING PRINCIPLES

1. Foundations before hype.
2. Depth before breadth for core subjects.
3. Projects before excessive passive consumption.
4. Understand mechanisms before abstractions where useful.
5. Use mature libraries for production work.
6. Implement selected important mechanisms yourself.
7. Do not specialise prematurely.
8. Keep DSA alive continuously.
9. Keep software engineering alive throughout ML learning.
10. Use university coursework as an input, but verify practical mastery independently.
11. Treat AI as software + data + models + evaluation + infrastructure.
12. Treat security as part of engineering.
13. Measure before optimising.
14. Prefer simple systems until complexity is justified.
15. Build evidence, not just knowledge claims.
16. Do not mistake certificates for competence.
17. Do not mistake activity for progress.
18. Do not restart the roadmap every time a new technology appears.
19. Let the active path stay small even though the master roadmap stays large.
20. Build for the next decade, not just the next six months.
21. If the foundation is weak, slow down and rebuild it before advanced material.

---

# 108. THE ESSENCE

The end goal is not:

> Know Python.

Not:

> Know machine learning.

Not:

> Know LLMs.

Not:

> Know Kubernetes.

The real goal is:

# **Become the kind of engineer who can learn the next technology because the underlying ideas are already familiar, the evidence is real, and the resources evolve without breaking the foundation.**

The full progression is:

```text
CODE
↓
THINK
↓
DESIGN
↓
BUILD
↓
ANALYSE
↓
MODEL
↓
DEPLOY
↓
MONITOR
↓
SCALE
↓
RESEARCH
↓
INVENT
```

That is the master trajectory.


---

# 109. AI-NATIVE ENGINEERING OVERLAY

This section is about how to operate as an engineer when AI is an active participant in the work. It is not a second AI/ML curriculum: LLM engineering, RAG, agents, evaluation and AI security stay in their phases (P23–P27, P39, P44) and checkpoint C6.

The principle: **AI output is an input to engineering, not proof of correctness.** The goal is AI-native, not AI-dependent.

## 109.1 Working loop

```text
Think
→ attempt
→ consult (AI or docs)
→ implement
→ verify
→ explain
→ retest
```

## 109.2 Modes

The mode depends on what you are doing right now. It decides how AI takes part, whatever your tier.

### Learn
When: the concept is new to you (mastery below Practised)
Summary: Use AI for explanations and hints. Try the problem yourself first.
AI can:
- explain a concept or show a worked example of a different problem
- give a hint when you are stuck after a real attempt
- ask you questions that expose a misunderstanding
- explain an error after you have written down your own guess
- give feedback on code you already wrote
Keep for yourself:
- the first attempt
- writing the solution to the exercise you are learning from
- after substantial help, solving a variation without AI, then explaining it back in your own words
- course rules: for CS50 work, use the CS50 Duck, not other AI tools

### Build
When: you can already do the underlying skill alone (mastery Practised or higher), or you are working on a project
Summary: AI can work with you up to your current tier. You own understanding and verification.
AI can:
- do whatever your current tier allows
Keep for yourself:
- deciding what to build and when it is done
- reading and understanding every line you keep
- running the checks: tests, types, lint, behaviour, edge cases

### Assess
When: gate attempts, unseen practice tasks, DSA problems before you have solved them, exams and graded coursework
Summary: AI off, or only what the course or employer allows. This is where you show what you can do alone.
AI can:
- review your solution after you have finished and recorded your own answer
Keep for yourself:
- the whole attempt

## 109.3 Tiers

### Tier 1 - Tutor
Unlock: start
Summary: AI explains, questions, hints and gives feedback. You make the primary attempt.
AI can:
- explain concepts and errors
- give hints and ask guiding questions
- diagnose misunderstandings
- give feedback on your code and explanations
You stay responsible for:
- the attempt, the solution and the understanding
Links: P01, G0, C1

### Tier 2 - Pair
Unlock: C1
Summary: AI proposes, reviews, debugs and refactors code with you on small tasks. You understand and verify everything you keep.
AI can:
- propose code for a function or small change
- review your code and point out defects
- help investigate and debug errors
- suggest refactorings and explain implementation decisions
You stay responsible for:
- writing or approving the tests first, so tests decide correctness
- reading every changed line before you apply it
- rejecting changes you cannot explain
- checking that every suggested package exists and is the one you meant
- never pasting secrets, keys or `.env` contents into a prompt
Links: P02, P07.3, P07.4, PR01, PR02

### Tier 3 - Supervised agent
Unlock: SG4
Summary: AI works at repository level on bounded tasks. You define the task, the boundaries and the checks, and you review the result.
AI can:
- inspect a repository and trace code paths
- identify the files involved in a change
- modify several files for a bounded task
- run tests and other tools you have allowed
You stay responsible for:
- defining the task, its scope and its acceptance criteria
- giving the context it needs: relevant files, architecture, constraints
- controlling permissions and tool access
- reviewing the plan before changes and the diff after
- verifying the result and explaining it
Operator security:
- secrets: no production credentials or real keys in the agent's environment
- permissions: least privilege; work on a branch or a copy
- destructive commands: approve deletes, migrations, force pushes and cloud commands yourself
- prompt injection: treat issues, READMEs, web pages, logs and dependencies as untrusted input that may contain instructions
- untrusted input plus private data plus outbound access is the dangerous combination; remove one
- recovery: commit before the agent starts so every change can be reverted
Links: P07.5, P08, P31, P39, C3, C7

### Building AI systems
Unlock: C5
Summary: Engineering AI-powered systems is covered by the existing phases and checkpoint C6. The overlay adds no content here.
Links: P23, P24, P25, P27, P39, P44, C6

## 109.4 Context engineering

Context engineering is giving an AI the information, tools and boundaries it needs to do a task reliably. It is task specification, not prompt wording.
- understand the architecture and find the relevant files before asking for a change
- state the goal, constraints, non-goals and acceptance criteria
- point to the documentation that actually applies
- keep the scope small enough to review
- keep project instruction files short: only conventions that are not obvious from the code
- check understanding: have the AI restate the plan and the files it will touch before it changes anything

## 109.5 Verification

Before you keep AI-produced work, check what applies:
- tests pass, and they test the right thing
- types and lint are clean
- the program behaves correctly when you run it, including edge cases
- no new security problem: input handling, secrets, dependencies
- you can explain every line you are keeping

## 109.6 Missions

### AIM-01 - Hint, not answer
Tier: 1
Requires: P01.1a
Goal: Use AI as a tutor without losing the learning.
You do: attempt a non-graded exercise for at least 15 minutes and write down where you are stuck
AI does: gives one hint that contains no code for the task
Verify: you fix it yourself; the next day you solve a variation with no AI
Evidence: a log entry marked "can do it alone"

### AIM-02 - Guess before you ask
Tier: 1
Requires: P01.1a
Goal: Diagnose errors instead of outsourcing them.
You do: read the traceback and write your own explanation of the cause
AI does: explains the error
Verify: compare its explanation with yours and with the Python documentation
Evidence: a log entry saying whether your guess was right

### AIM-03 - Tests decide
Tier: 2
Requires: C1, P07.3
Goal: Treat generated code as unverified until tests pass.
You do: write tests for a small function from its specification before any code exists
AI does: writes an implementation, then suggests test cases you missed
Verify: run your tests; judge each suggested test as valid or not
Evidence: at least one defect or test gap found and logged

### AIM-04 - Review the diff
Tier: 2
Requires: C1, P02.1
Goal: Review AI changes the way you would review a pull request.
You do: read every changed line before applying it and write the commit message yourself
AI does: proposes a change to one of your own repositories
Verify: tests pass and you can explain each part of the change
Evidence: at least one suggestion rejected, with the reason

### AIM-05 - Check before you install
Tier: 2
Requires: C1, P03.1
Goal: Keep hallucinated or malicious packages out of your projects.
You do: before installing any package an AI suggests, confirm it exists, is maintained and is the one you meant; pin the version
AI does: suggests a package for a task
Verify: the registry page, the maintainers, the release history
Evidence: a log entry and a pinned requirements file

### AIM-06 - Refactor with a safety net
Tier: 2
Requires: P07.1, P07.3
Goal: Change structure without changing behaviour.
You do: write tests that pin down the current behaviour
AI does: proposes the refactor
Verify: the same tests pass, and no needless abstraction was added
Evidence: before and after, with your judgement of the change

### AIM-07 - Map an unfamiliar repository
Tier: 3
Requires: SG4
Goal: Understand code you did not write.
You do: in 60 minutes, find the entry points, trace one request from input to storage, and find where the tests live
AI does: answers your questions about the code
Verify: open the file or run the code for every claim before you believe it
Evidence: your map, plus at least one AI claim you proved wrong

### AIM-08 - Bounded change in an unfamiliar repository
Tier: 3
Requires: SG4, P07.5
Goal: Supervise an agent on a real change.
You do: define the task, its boundaries and its acceptance tests; review the agent's plan before it edits; review the diff after
AI does: inspects the repository, traces the relevant code path, edits the files involved, runs the tests
Verify: the tests, your own reading of the diff, and a description of the change written by you
Evidence: the merged change, plus what the agent got wrong or nearly got wrong

### AIM-09 - Threat-model your agent
Tier: 3
Requires: SG4, P03.1
Goal: Run agents safely.
You do: list what the agent can read, what untrusted input it takes in, and what it can send out or change; remove one of the risky capabilities
AI does: runs a task inside the reduced setup
Verify: plant a harmless instruction in a test repository's README and check whether the agent follows it
Evidence: the written list and what happened

### AIM-10 - Brief an agent well
Tier: 3
Requires: AIM-08
Goal: Give an agent the context it needs, and no more.
You do: write a short task brief (goal, relevant files, constraints, non-goals, acceptance criteria) and a minimal project instruction file with only non-obvious conventions
AI does: restates the plan and the files it will touch, then does the task
Verify: correct any misunderstanding before it edits; compare the result and the rework with and without the brief
Evidence: a short comparison note

### AIM-11 - Timed code-comprehension session
Tier: 3
Requires: C3
Goal: Perform under interview-like conditions.
You do: in 60 minutes, fix planted bugs and extend a feature in an unfamiliar multi-file repository, explaining your reasoning out loud
AI does: acts as the assistant you would have in the interview
Verify: run the tests and explain every change you accepted
Evidence: a session log; in the same week, one timed AI-free DSA session

### AIM-12 - Audit a benchmark claim
Tier: 3
Requires: P15.3
Goal: Read evaluation claims critically.
You do: pick a published coding-benchmark result and look for leakage, flawed tests or scaffolding effects
AI does: helps find the primary sources
Verify: rely on primary sources only
Evidence: a one-page note

## 109.7 Checkpoint integration

The overlay adds no separate gates. Its expectations live inside existing checkpoints: C1 and C2 practical gates run in Assess mode; C3 adds unfamiliar-codebase work with an assistant and supervised agent use; C6 adds indirect prompt-injection cases; C7 adds a timed AI-assisted code-comprehension session.
