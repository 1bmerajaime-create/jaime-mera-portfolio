// Lightweight Q&A knowledge base for the portfolio chat.
// Parsed into window.JAIME_QA at load time.

(function () {
  const QA_TEXT = `
ABOUT YOU / PERSONAL (15 QUESTIONS)
=====================================

Q: Who are you?
A: I'm Jaime Mera, Product Design Lead at AILY Labs in Madrid. Some say I'm a Product Designer, but truly, what I really do is try to make everyone's life easier. 6+ years designing for brands like Adidas, major banks, and B2B SaaS companies.

Q: Tell me about yourself.
A: I'm a product designer who focuses on business impact over aesthetics. Currently leading design at an AI company in Madrid. Before that, spent 3+ years at Accenture Song working with Adidas, Banco Sabadell, and others. Built 2 design systems from scratch, led mobile apps to global markets, and consistently delivered measurable results. Outside of work, I'm probably using AI tools to make my life easier or exploring Madrid.

Q: Where are you based?
A: Madrid, Spain. Born and raised here, studied in London for a year, but Madrid's home. Open to remote work or relocation for the right opportunity though.

Q: What do you do in your free time?
A: Honestly, I use AI tools (Claude, ChatGPT, Midjourney) for personal projects and experimentation. It's both hobby and skill-building. Also enjoy good food, exploring Madrid, and staying up-to-date with design and tech trends. I'm a bit of a design systems nerd.

Q: What's your background before design?
A: I started in advertising and communications at Universidad San Pablo CEU. Studied abroad in London at Westminster. Worked at McCann and did digital marketing at Bankinter before discovering product design at Accenture. I've been in product design for 6+ years now.

Q: Are you Spanish?
A: Yep, born and raised in Madrid. Studied abroad in London for a year, which was great for perspective. I'm fluent in Spanish and English.

Q: What languages do you speak?
A: Spanish and English fluently. I studied in London for a year, so my English is solid. I also understand enough Portuguese to get by, but I'm not fluent.

Q: What's your design philosophy?
A: Design solves business problems, not just aesthetic ones. I start with metrics, not wireframes. I ask "what's the conversion rate? where do users drop off?" and then I design backwards from outcomes. Less pixel-pushing, more problem-solving.

Q: How would your colleagues describe you?
A: Probably as someone who's direct, collaborative, and a bit obsessed with metrics. I bring business context into design conversations and push teams to focus on outcomes. Also, I'm the guy who's always testing new AI tools to make everyone faster.

Q: What motivates you?
A: Seeing real impact. When a design system I built makes a team 60% faster, or when a feature drives a 35% conversion lift – that's what gets me up in the morning. I care about outcomes, not just outputs.

Q: What's your work style?
A: Fast iteration, data-informed decisions, and strong collaboration. I don't do ivory tower design – I work closely with product, engineering, and users. I ship quickly, measure everything, and iterate based on data. Also, I use AI heavily to speed up the boring parts so I can focus on the real thinking.

Q: Are you a team player?
A: Absolutely. Design doesn't happen in isolation. I've worked with cross-functional teams across time zones, led workshops with stakeholders, and collaborated with 100+ designers and developers. Good products come from good teamwork.

Q: What makes you different from other designers?
A: Three things: I speak business language (metrics, ROI, efficiency), I've built design systems from scratch (not just maintained someone else's), and I'm AI-native. Most designers aren't fully comfortable in boardrooms talking conversion rates or architecting scalable systems from zero. I am.

Q: What's your superpower?
A: Translating complex business problems into simple, elegant solutions users actually want to use. And building systems that scale so teams can move faster. Also, using AI tools to be annoyingly fast compared to most designers.

Q: What are your weaknesses?
A: I get impatient with endless discussions that don't lead to action. I'd rather ship something imperfect and iterate than debate the perfect solution for weeks. I also sometimes move faster than slower-paced teams are used to, so I have to be intentional about bringing everyone along.

=====================================
MOTIVATION / WHY DESIGN (10 QUESTIONS)
=====================================

Q: Why product design?
A: I kind of stumbled into it. I started in advertising, realized I wanted to build things that actually improve people's lives, not just sell them stuff. I discovered product design at Accenture and never looked back. The ability to solve real problems at scale is addictive.

Q: What do you love about design?
A: The impact. When you design something right, millions of people's lives get even a tiny bit easier. I love seeing a feature go live and watching metrics move in the right direction. There's something very satisfying about making complex things simple.

Q: Why did you leave advertising?
A: Advertising felt shallow to me. I was making things look pretty to sell products. Product design lets me solve actual problems and improve people's daily lives. Way more fulfilling.

Q: What gets you excited about a project?
A: Complexity and scale. Give me a messy problem serving millions of users and I'm happy. Bonus points if I can build a system that makes future work easier for everyone – that's where design systems come in.

Q: Why do you care about design systems?
A: Because they're force multipliers. A good design system makes whole teams faster, more consistent, and more scalable. I built Galatea and Click from scratch – watching those systems get adopted by 100+ people and 8+ teams is incredibly satisfying.

Q: What's your favorite part of the design process?
A: The research phase and the "aha" moment when the solution clicks. I love talking to users, finding patterns in their pain points, then designing something that just makes sense. I also really enjoy seeing measurable impact after launch.

Q: Why did you join an AI company?
A: I was already using AI tools daily (Claude, ChatGPT, Midjourney), so joining AILY Labs made a lot of sense. I wanted to be at the forefront of AI product design, not playing catch-up. Plus, working on AI-powered products is just more interesting right now.

Q: What problem are you most passionate about solving?
A: Making complex systems actually usable. Whether it's B2B software or banking apps, I love taking complicated workflows and making them intuitive. Most enterprise software is terrible – I enjoy fixing that.

Q: What drives you professionally?
A: Measurable impact and continuous growth. I want every project to have clear business outcomes (60% faster, 35% conversion lift, etc.) and every year to add new skills. Stagnation is not really my thing.

Q: Why should we hire you?
A: Because I deliver results, not just pretty Figma files. I’ve built design systems that made teams 60% faster, driven 35% conversion lifts, and launched products to millions of users globally. I speak your business language, move fast, and care about outcomes. Plus, I’m AI-native, which is basically how everyone will work in a few years.

=====================================
EXPERIENCE / BACKGROUND (15 QUESTIONS)
=====================================

Q: Walk me through your career.
A: I started in advertising (McCann, Bankinter), discovered product design at Accenture Interactive in 2018. Then moved to Fjord, and later Accenture Song where I spent 3+ years on major clients like Adidas and Banco Sabadell. Now I’m leading design at AILY Labs, an AI company. Each step has been about increasing impact and responsibility.

Q: What did you do at AILY Labs?
A: I lead product design for AI-powered tools. I focus on high-impact features, patterns for AI experiences, and using AI to accelerate our own workflows. It’s a nice mix of early-stage startup chaos and cutting-edge AI design challenges.

Q: What did you do at Accenture Song?
A: I worked with major clients across industries. I led the Adidas wholesale mobile app (15+ markets), built the Galatea design system for Banco Sabadell, helped drive BeeData from 32 to 58 NPS, designed Wivai for CaixaBank, and more. It taught me how to operate at serious scale with global teams.

Q: What did you do at Fjord?
A: I focused on rapid prototyping, visual storytelling, and interaction design for various clients. It was a great training ground for communicating design decisions to C-level executives and moving fast in ambiguous environments.

Q: What was your first design role?
A: UX & Digital Innovation Analyst at Accenture Interactive. I did journey mapping, service design, and digital transformation work. Basically learned the fundamentals while working on real client projects.

Q: How many years of experience do you have?
A: 6+ years in product design (since 2018). Before that I was in advertising and marketing. So about 8 years total in design-adjacent roles, with the last 6 focused purely on product design.

Q: What's been your biggest career achievement?
A: Probably co-building the Click design system at Adidas. Watching something I helped create get adopted by 100% of the B2B design team and make them 60% faster is hard to beat. Close second is taking the Adidas mobile app from research to launch in 15+ markets.

Q: Have you worked at startups or enterprises?
A: Both. Right now I’m at a startup (AILY Labs) and before that I was at a massive consultancy (Accenture Song) working with Fortune 500 clients. I can handle both startup chaos and enterprise bureaucracy.

Q: Have you managed teams?
A: I’ve led project teams and mentored junior designers, but I haven’t had formal people-manager titles yet. On the Adidas mobile app, I was the design lead coordinating with product, engineering, and regional stakeholders across 15+ markets.

Q: What industries have you worked in?
A: Fashion/retail (Adidas), banking (Sabadell, CaixaBank), B2B SaaS (BeeData), enterprise software (Rio Tinto), sports (MotoGP), energy (Shell), and now AI (AILY Labs). So a pretty healthy mix of B2B and B2C.

Q: Have you worked globally?
A: Yes. The Adidas mobile app launched in 15+ markets globally. I’ve also worked with teams across Europe, Asia, and the Americas. I’m very comfortable with time zones and cultural differences.

Q: What's the largest scale you've worked at?
A: Adidas Click serves thousands of wholesale buyers globally. Banco Sabadell has millions of banking customers. BeeData works with enterprise clients. I’m very comfortable designing for large-scale products and ecosystems.

Q: Have you worked remote?
A: Yes, extensively. I worked remotely during COVID and continue hybrid/remote at AILY Labs. I’m very comfortable with distributed teams, async communication, and remote collaboration tools.

Q: What companies have you worked for?
A: AILY Labs (current), Accenture Song, Fjord, Accenture Interactive, Bankinter, and McCann. It’s a solid mix of startup, consultancy, agency, and corporate.

Q: What's your leadership experience?
A: I led the Adidas mobile app project from research to global launch. I co-led design system development, ran workshops with stakeholders, mentored junior designers, and presented to C-level executives. So plenty of practical leadership, even before the formal titles.

=====================================
PROJECTS / PORTFOLIO (20 QUESTIONS)
=====================================

Q: What's your best project?
A: It’s a tie between Adidas Click and Banco Sabadell. Adidas because I led the mobile app to 15+ markets and co-built a design system that made the team 60% faster. Sabadell because I built Galatea from scratch and saw a 35% conversion lift. Both had massive scale and very clear impact.

Q: Tell me about Adidas.
A: Click is Adidas's global B2B e-commerce platform. I led two big initiatives: the wholesale mobile app (15+ markets, around 40% faster reordering) and co-built the Click design system (60% faster design-to-dev, 100% adoption). I interviewed floor employees, designed a scanning-based ordering flow, and helped build a system that could scale globally across teams and products.

Q: Tell me about Banco Sabadell.
A: I built Galatea – a comprehensive design system for one of Spain's largest banks – from zero. Not maintaining, actually building. We ended up with 200+ components, full documentation, tokens, and governance. Results: 35% mobile conversion increase, 45% more qualified leads, and about 50% faster design-to-dev time. It now supports 8 teams and 150+ designers and developers.

Q: Tell me about BeeData.
A: BeeData is a B2B SaaS analytics platform. I led a redesign focused on making complex data accessible to non-technical users. We grew subscriptions by 20–30%, improved NPS from 32 to 58, cut onboarding from 3 weeks to 3 days, and reduced support tickets by about 40%. Not bad for a product that started as “for engineers only”.

Q: Tell me about Wivai.
A: Wivai is CaixaBank's move into retail e-commerce. I designed the whole platform from brand to checkout, with a mobile-first approach since about 70% of Spanish traffic is mobile. It launched to 3.5M+ CaixaBank customers, hit around 233K monthly visits, and reduced bounce rate by 33.6%.

Q: Tell me about MotoGP.
A: For MotoGP I worked on a visual redesign and a bunch of proof-of-concept features for the official digital experience. I created new design guidelines, redesigned key pages for video and race-day use, and built 8 interactive POC features. The focus was heavily mobile-first, since about 60% of race day traffic is on phones.

Q: Tell me about Rio Tinto.
A: Rio Tinto was an enterprise HR platform for a global mining company. I designed “True View”, a unified system handling employee data across multiple countries and regulations. We focused on making HR workflows actually usable while staying compliant. The result was a roughly 30% reduction in routine admin time and a smoother experience for people moving between regions.

Q: What project are you most proud of?
A: The Adidas Click design system is up there. Building something from scratch that gets adopted by 100% of a team and demonstrably makes them 60% faster is kind of the dream. Seeing it scale across all B2B products was very satisfying.

Q: What's your most challenging project?
A: Banco Sabadell, hands down. Building a design system from zero for a huge bank with multiple segments (retail, private, business) and strict regulations is not exactly simple. We had to balance innovation with compliance, segment differentiation with consistency, and speed with quality.

Q: What project had the biggest business impact?
A: BeeData is a strong contender: 20–30% subscription growth and NPS jumping from 32 to 58 is huge for a B2B SaaS company. Sabadell is close too with its 35% conversion lift and 45% more leads – that’s direct revenue impact.

Q: Have you done any mobile projects?
A: Yes, mobile is kind of my thing. I led the Adidas wholesale app (15+ markets), worked on Sabadell with about 65% mobile traffic, designed Wivai for ~70% mobile traffic, and MotoGP for 60% race day mobile usage. I almost always design mobile-first.

Q: Have you built design systems?
A: Yes, two major ones from scratch. Galatea for Banco Sabadell (200+ components, 8 teams, 150+ people) and Click for Adidas (50+ components, 100% B2B adoption, 60% faster dev). Both used Atomic Design, tokens, documentation – the full package.

Q: Show me your process.
A: Take the Adidas mobile app for example: I conducted 15+ interviews, shadowed users on the shop floor, identified pain points, then designed and tested mobile-first prototypes. We iterated based on real feedback and then launched globally. In short: research → design → test → iterate → measure.

Q: What metrics have you improved?
A: A few highlights: 60% faster design-to-dev (Adidas), 35% conversion lift and 45% more leads (Sabadell), 20–30% subscription growth and NPS 32→58 (BeeData), 40% faster reordering (Adidas), 30% efficiency gains (Rio Tinto), and a 33.6% bounce rate reduction (Wivai).

Q: Have you done user research?
A: Yes, a lot. I ran 15+ interviews and on-floor shadowing for Adidas, did usability testing with wholesale buyers, interviewed 25+ customers for BeeData, and surveyed 50+ racing fans for MotoGP. I try very hard not to design based only on my own opinions.

Q: Have you worked B2B?
A: Yes, B2B is basically my comfort zone. Adidas wholesale, BeeData, and Rio Tinto are all heavy B2B/enterprise products. The complexity and multiple user types make it interesting.

Q: Have you worked B2C?
A: Yes. Wivai (e-commerce), Sabadell (consumer banking), and MotoGP (sports content) are all B2C or prosumer. I like the mix of B2B depth and B2C polish.

Q: What's your design system experience?
A: I built Galatea from scratch for Sabadell and co-built Click from scratch for Adidas. That means architecture, tokens, components, documentation, and governance – not just drawing buttons. Both systems hit near 100% adoption and made teams 50–60% faster.

Q: Have you launched products globally?
A: Yes. The Adidas mobile app launched in 15+ markets across Europe, Asia, and the Americas. That came with all the fun of multiple languages, different wholesale models, and plenty of constraints.

Q: What's your biggest failure?
A: Early in my career I designed a feature based purely on assumptions and internal opinions. We shipped it, users hated it, and usage was terrible. Since then I’ve been slightly obsessed with talking to real users before committing to big design decisions.

=====================================
SKILLS / EXPERTISE (15 QUESTIONS)
=====================================

Q: What are your core skills?
A: Design systems architecture, mobile-first design, user research, business-focused product strategy, cross-functional collaboration, and AI-powered workflows. I’m strong in Figma, comfortable with code, and fluent in metrics and business language.

Q: What tools do you use?
A: Primarily Figma, plus Adobe Creative Suite, Miro/FigJam, Notion, Jira, and a lot of AI tools like Claude and ChatGPT. I also use Midjourney for exploration and have enough HTML/CSS knowledge to understand technical constraints.

Q: Are you technical?
A: I’m not a full-time engineer, but I understand technical constraints and work closely with dev teams. I know enough about code and architecture to avoid designing impossible things and to have useful conversations with engineers.

Q: Do you code?
A: Basic HTML/CSS, enough for prototypes and to understand implementation details. My main focus is design, but I’m comfortable jumping into code discussions and using AI to generate quick prototypes when needed.

Q: What's your Figma skill level?
A: Fair to say “expert”. I’ve built two production design systems in Figma with hundreds of components, variants, and tokens. I use auto-layout, dev mode, and libraries heavily and I’ve trained other designers on best practices.

Q: Do you do user research?
A: Yes, and I get slightly suspicious when designers don’t. I’ve conducted 100+ interviews, shadowed users in their environments, run usability tests, and dug through support tickets. I prefer data and real voices over assumptions.

Q: Can you do visual design?
A: Yes. I led the visual redesign for MotoGP, created the brand identity for Wivai, and designed 200+ UI components for Galatea. I care a lot about typography, color, layout, and motion – but always in service of the product.

Q: What industries do you know?
A: Fashion/retail, banking/fintech, B2B SaaS, enterprise software, sports/entertainment, energy, and AI. The fun part is borrowing patterns from one industry and adapting them to another.

Q: What's your leadership style?
A: Collaborative but decisive. I gather input, synthesize, and then make clear calls. I try to give people autonomy with strong guardrails and keep everyone focused on outcomes, not just shipping features.

Q: Are you comfortable presenting?
A: Very. I’ve presented to C-level execs, led workshops with 20+ stakeholders, pitched to MotoGP leadership, and trained teams on design systems. I actually enjoy the storytelling part.

Q: How do you handle feedback?
A: I actively ask for it and treat it as part of the process. That said, I differentiate between opinion-based feedback and insight-based feedback. I’m happy to push back if something goes against user research or business goals.

Q: Can you work with developers?
A: Absolutely. I’ve partnered with dozens of developers across projects, understand their constraints, and know how to make designs that are realistic to build. Good design-dev collaboration is non-negotiable.

Q: Do you understand business?
A: Yes, that’s one of my main strengths. I’m comfortable talking about conversion, churn, CAC, LTV – the fun acronyms. I connect design decisions directly to business metrics whenever possible.

Q: What's your AI experience?
A: I use Claude, ChatGPT, and Midjourney daily to speed up research, exploration, and even parts of visual design. At AILY Labs I also design AI-powered products, so I’m used to thinking about model behavior, UX for AI, and all the lovely edge cases.

Q: What methodologies do you use?
A: I pull from Atomic Design, Design Thinking, Lean UX, and Jobs to Be Done depending on the situation. I’m not overly religious about any framework – the point is to solve the problem, not worship the process.

=====================================
PROCESS / METHODOLOGY (10 QUESTIONS)
=====================================

Q: What's your design process?
A: I usually go business metrics → user research → design → prototype → test → ship → measure → iterate. I don’t believe in huge waterfall phases. I prefer lots of tight loops where learning feeds directly back into the work.

Q: How do you start a project?
A: I start by asking what business problem we’re trying to solve and what metric we’re trying to move. Then I talk to users or dig into existing data, and only after that do I touch Figma. Metrics and reality first, pixels second.

Q: How do you prioritize features?
A: Impact vs effort, plus what users actually need. I look at which features move key metrics most for reasonable effort, and I validate that with research. Stakeholder wishlists are nice, but users and data get the final vote.

Q: How do you handle tight deadlines?
A: I cut scope, not quality. I’ll define a sharp MVP, ship it, and then iterate. Perfect is the enemy of shipped – especially under pressure.

Q: How do you work with product managers?
A: As partners. We align on goals and metrics, then co-own the outcome. They handle roadmap, I handle experience, and we work together so those things don’t drift apart.

Q: How do you validate designs?
A: Usability tests, prototype tests, and once things are live, analytics and sometimes A/B tests. I never assume a design is right until I’ve watched real users interact with it.

Q: How do you handle stakeholder disagreements?
A: I bring data – research recordings, usability findings, competitive analysis, metrics. If it’s still a tie, I’ll propose small experiments rather than endless debate. Reality usually settles the argument.

Q: How do you scale design?
A: Through design systems, shared patterns, and clear documentation. You make the right thing the easy thing. That’s how we got 50–60% speed improvements at Adidas and Sabadell.

Q: How do you measure success?
A: Business metrics first: conversion, efficiency, retention, NPS – whatever makes sense for the product. Also adoption and qualitative feedback: are people actually using what we built, and do they find it valuable?

Q: What's your collaboration style?
A: Transparent and slightly over-communicative. I’d rather people roll their eyes at “too many updates” than be surprised by anything. I keep comms async-friendly but jump on calls when nuance is needed.

=====================================
CHALLENGES / PROBLEM SOLVING (10 QUESTIONS)
=====================================

Q: Tell me about a difficult project.
A: BeeData was pretty challenging. The interface was built by engineers for engineers, and non-technical users were totally lost. We had to make serious analytics feel approachable without turning it into a toy. After a mix of interviews, IA redesign, and better onboarding, NPS climbed from 32 to 58.

Q: How do you handle ambiguity?
A: I start with whatever we know, make assumptions explicit, and move quickly to prototypes and tests. I’d rather learn from reality than sit in endless “what if” conversations. Ambiguity is normal; paralysis is optional.

Q: Tell me about a conflict you resolved.
A: At Sabadell, some stakeholders wanted completely different visual styles for retail vs private banking. I proposed a shared foundation with different expressions – same system underneath, tailored surfaces on top. That let us keep consistency and still respect segment needs.

Q: What's your biggest design challenge?
A: Making enterprise software not miserable to use. Most B2B tools are clearly built without enough user research. I enjoy digging into those environments and making them feel human.

Q: How do you handle scope creep?
A: By making trade-offs explicit. If scope goes up, something else has to change: timeline, resources, or quality. I’m direct about that and try to align everyone around what matters most.

Q: How do you deal with pressure?
A: I prioritize ruthlessly and communicate clearly. Under pressure, I narrow focus to the work that moves metrics most, and I keep stakeholders updated so nothing is a surprise.

Q: Tell me about a time you failed.
A: Early on, I shipped a feature based on internal opinions instead of talking to users. It flopped and barely got used. That was a very effective way to become the “let’s talk to users first” person on future projects.

Q: How do you balance speed and quality?
A: By separating what needs to be great from what just needs to be good enough for now. I’ll push for high quality on core flows and happily ship simpler solutions on edge cases, then circle back based on real usage.

Q: How do you say no to stakeholders?
A: Politely, with reasons. I’ll say something like “here’s what users told us, and here’s how this request affects our goals and timeline”. It’s rarely a flat no – more often it’s “not now” or “let’s test it”.

Q: What's your approach to legacy systems?
A: Carefully and incrementally. You can’t nuke a legacy system from orbit (sadly), so I focus on the highest-impact areas, introduce new patterns there, and gradually migrate. Design systems are a big part of that approach.

=====================================
TEAMWORK / COLLABORATION (10 QUESTIONS)
=====================================

Q: How do you work with developers?
A: Closely. I involve them early, get their input on feasibility, and keep them looped in as designs evolve. I use Figma dev mode, document edge cases, and stay available during implementation so there are no surprises.

Q: How do you work with product managers?
A: As a partnership. We align on what success looks like, then split responsibilities but share ownership. I expect PMs to bring clarity on business and roadmap, and they expect me to bring clarity on users and experience.

Q: How do you handle remote work?
A: By leaning into async communication and documentation. I write things down, keep specs up to date, and use calls for alignment rather than status updates. I’ve worked with teams across more than 15 time zones – structure matters.

Q: What makes a good team?
A: Shared goals, clear ownership, honest communication, and a culture where people can say “I don’t know” without fear. The best teams I’ve worked on had strong PMs, collaborative engineers, and designers who cared about business outcomes.

Q: How do you mentor junior designers?
A: I walk them through my thinking instead of just giving them answers. I give them real ownership with safety nets, review their work with specific feedback, and push them to connect their designs to business outcomes, not just “does it look good”.

Q: How do you handle difficult team members?
A: Direct conversation, one-on-one. I try to understand what’s going on from their side, explain the impact their behavior has, and align on expectations. Most issues are misalignment, not malice.

Q: What's your communication style?
A: Direct, clear, and fairly frequent. I’d rather risk oversharing than leave people guessing. I adapt tone based on audience – more casual with designers, more structured with leadership.

Q: How do you build trust?
A: By doing what I say I’ll do, being transparent about risks, and admitting when I don’t know something. Consistency over time builds trust more than any big moment.

Q: How do you work cross-functionally?
A: I try to speak the native language of whoever I’m talking to. With engineers I talk about feasibility and edge cases, with PMs I talk about metrics and prioritization, with business I talk about ROI and risk.

Q: What's your ideal team size?
A: Small enough to move fast, big enough to cover the bases. Somewhere around 3–7 people directly working on a problem is usually ideal in my experience.

=====================================
FUTURE / CAREER GOALS (10 QUESTIONS)
=====================================

Q: What are your career goals?
A: I want to lead design at a high-growth startup or scale-up, build and support strong design teams, and keep working on products with real business impact. Long term, I’m also curious about starting something of my own.

Q: Where do you see yourself in 5 years?
A: Ideally as Head of Design or Design Director at a growth-stage company, leading a small but mighty design team. I’d love that to be at an AI-first company working on products with serious scale.

Q: What role are you looking for?
A: Senior/Lead Product Designer or early Design Manager roles. I like a mix of hands-on work and shaping the direction of products and teams.

Q: What type of company interests you?
A: High-growth startups and scale-ups where design has a real seat at the table. AI companies, B2B SaaS, fintech, or healthtech are particularly interesting to me.

Q: What's your ideal work environment?
A: Collaborative, fairly fast-paced, and focused on outcomes rather than politics. Small teams with high autonomy and a culture where experiments are encouraged.

Q: What do you want to learn next?
A: Deeper AI product design patterns, design leadership, growth experimentation, and a bit more technical depth around how AI models work. I’m also interested in design ops and how to scale teams without losing quality.

Q: Why leave AILY Labs?
A: I’m not necessarily sprinting for the exit, but I’m always open to strong opportunities. The main things that would make me move are bigger impact, more complex challenges, or a chance to build and lead a team.

Q: What's your salary expectation?
A: Given my experience and impact, I’d be looking around the €60–80K range in Europe, depending on role scope, equity, and benefits. But I care a lot about the overall package and growth opportunities, not just the base.

Q: Are you open to relocation?
A: For the right opportunity, yes. Madrid or remote is ideal, but I’d consider places like Barcelona, London, Berlin, or other European hubs. I’d look at the US for exceptional roles.

Q: What's your dream job?
A: Head of Design at an AI-first company solving real problems at scale, working with a small high-impact team. Plenty of autonomy, strong partners in product and engineering, and a clear link between what we design and the metrics that matter.

=====================================
SITUATIONAL / BEHAVIORAL (10 QUESTIONS)
=====================================

Q: Why are you interested in this role?
A: [Customize based on company] The combination of your specific challenge, the team you’re building, and your mission lines up nicely with what I’m good at. I bring experience in design systems, mobile-first products, and measurable impact – which fits well with what you’re trying to do.

Q: What's your greatest strength?
A: Translating business problems into user-friendly solutions that actually move the metrics. I’m comfortable talking ROI and conversion with leadership and then turning that into concrete design decisions.

Q: What's your greatest weakness?
A: I move fast, which can be a shock in slower organisations. I’ve learned to slow down just enough to bring people with me, but my default is still “let’s ship and learn”.

Q: Why should we hire you?
A: I build systems and products that deliver real results. I’ve made teams 60% faster, driven 35% conversion lifts, and helped launch products to millions of users. I can talk to your C-suite about metrics and then sit with your designers and engineers to make it real.

Q: Describe your ideal project.
A: A messy, complex problem with high stakes and lots of impact potential. Something like a B2B platform serving thousands of users where a better design system and workflows could save teams tons of time and drive revenue.

Q: How do you handle criticism?
A: I treat it as data, not a personal attack. If feedback is grounded in user needs or business goals, I’ll usually act on it quickly. If it’s purely subjective, I’ll dig deeper and see what’s really behind it.

Q: What questions do you have for us?
A: I’d want to know what metrics define success for this role, how design currently influences product decisions, what your biggest design challenges are, and what growth paths look like on your team.

Q: Tell me about your management style. (if applying for lead role)
A: Lead by example, communicate clearly, and keep the team focused on outcomes. I like to give designers autonomy with strong support, regular feedback, and clear growth paths. Also, I try hard to shield the team from unnecessary noise.

Q: What's your notice period?
A: Typically around one month, but it depends on current projects and transition plans. I care about leaving my current team in a good place.

Q: Are you interviewing elsewhere?
A: I’m exploring options, yes. I’m looking for the right fit – interesting problems, strong teams, and a place where design is treated as a strategic function, not decoration.

=====================================
TECHNICAL SKILLS & TOOLS (15 QUESTIONS)
=====================================

Q: What design tools are you proficient in?
A: Figma is my main tool - expert level, built 2 production design systems with 200+ components. Also Adobe Creative Suite (Photoshop, Illustrator, After Effects), Miro/FigJam for workshops, and increasingly AI tools like Claude and Midjourney. Comfortable with Sketch and Adobe XD from past projects.

Q: Do you know Sketch?
A: Used to use it daily, now primarily Figma. Comfortable switching back if needed, but honestly Figma's collaborative features and component system are superior for team work.

Q: Can you use Adobe XD?
A: Yes, though Figma is my preference. Used XD on several projects at Accenture. The principles are the same - I can adapt to whatever tool the team uses.

Q: What prototyping tools do you use?
A: Mainly Figma for interactive prototypes. Also used Principle and ProtoPie for more complex animations. Honestly, Figma's prototyping has gotten good enough that I rarely need other tools anymore.

Q: Do you know After Effects?
A: Basic motion graphics and animation, yes. I can create micro-interactions and export for developers. Not a motion designer, but I understand animation principles and can prototype motion.

Q: How comfortable are you with HTML/CSS?
A: Comfortable enough to have intelligent conversations with developers and understand constraints. I can read code, make minor tweaks, and prototype simple things. Not a developer, but I speak the language.

Q: Do you know JavaScript?
A: Basic understanding - enough to know what's feasible and communicate with engineers. I use AI tools to generate JS for prototypes sometimes. Focus is on design, not development.

Q: What project management tools do you use?
A: Jira, Linear, Asana - whatever the team uses. Also Notion for documentation, Confluence for knowledge sharing. Comfortable with agile workflows and sprint planning.

Q: What analytics tools do you use?
A: Google Analytics, Mixpanel, Hotjar for user behavior. I review analytics regularly to inform design decisions. Can set up basic tracking and interpret data, not a data scientist but data-literate.

Q: Do you know Principle?
A: Used it for prototyping animations before Figma's prototyping improved. Can use it if needed, but Figma handles 90% of what I need now.

Q: What collaboration tools do you use?
A: Slack for quick communication, Zoom/Meet for calls, Miro/FigJam for workshops, Figma for design collaboration, Notion/Confluence for documentation. Comfortable with async and sync work.

Q: Do you use version control?
A: For design: Figma's version history and branching. For code: basic Git understanding - can commit, push, pull. Not managing repos, but I understand the workflow.

Q: What AI tools do you use?
A: Claude and ChatGPT daily for research, content generation, critique, and coding help. Midjourney for image generation and exploration. I'm probably in the top 1% of designers using AI effectively.

Q: How do you hand off to developers?
A: Figma Dev Mode with detailed specs, component documentation, design tokens, and edge case notes. Plus I stay available during implementation for questions. Good handoff = clean code.

Q: What's your Figma skill level specifically?
A: Expert. Built 2 production systems with complex variants, auto-layout, tokens. Know libraries, components, variants, dev mode inside out. I train other designers on Figma best practices.

=====================================
DESIGN DECISIONS & PHILOSOPHY (15 QUESTIONS)
=====================================

Q: How do you make design decisions?
A: Data first - what do metrics and user research say? Then design principles, then aesthetics. If data conflicts with intuition, I trust data. Decisions should be defensible, not based on personal preference.

Q: How do you handle subjective feedback?
A: Distinguish between preferences ("I don't like blue") and valid concerns ("users might not see this"). Push back on preferences, listen to concerns. Use data to resolve disagreements.

Q: What's your approach to accessibility?
A: Baked in, not bolted on. WCAG AA minimum. Proper contrast ratios, keyboard navigation, screen reader support, focus states. Accessibility makes products better for everyone, not just edge cases.

Q: How do you approach mobile design?
A: Mobile-first always. Design for the smallest screen, then adapt up. Most users are mobile (60-70% typically), so it's not an afterthought. Thumb zones, touch targets, one-handed use matter.

Q: What's your typography philosophy?
A: Hierarchy is everything. Every size should have a purpose. System fonts when possible for performance. Custom fonts only when brand requires it. Readability > aesthetics.

Q: How do you approach color?
A: Functional before decorative. Color should communicate (success, error, warning, info), not just look pretty. Accessible contrast ratios are non-negotiable. Build flexible color systems with tokens.

Q: What's your stance on dark mode?
A: Offer it if users want it, but design for one mode first (usually light), then adapt. Don't just invert colors - dark mode needs different contrast ratios and considerations.

Q: How do you handle animation?
A: Purposeful, not decorative. Animation should guide attention, provide feedback, or smooth transitions. 200-300ms for most UI animations. Respect reduced-motion preferences.

Q: What's your approach to white space?
A: Critical for hierarchy and readability. Generous spacing makes interfaces feel premium and easy to scan. Tight spacing feels cluttered and stressful. More space, less noise.

Q: How do you decide what to design?
A: Impact vs effort. What moves key metrics most with least work? Also, what users actually need based on research, not what stakeholders assume. Kill features ruthlessly.

Q: What's your opinion on skeuomorphism vs flat design?
A: Neither extreme. Some depth and affordances help usability (buttons should look clickable), but excessive decoration is noise. Functional clarity > style trends.

Q: How do you approach forms?
A: Make them short. Only ask for what you absolutely need. Clear labels, helpful error messages, smart defaults. Forms are friction - reduce friction everywhere possible.

Q: What's your data visualization philosophy?
A: Clarity over cleverness. Use standard chart types unless there's a good reason not to. Direct labels over legends. Show data, minimize chart junk. Edward Tufte's principles basically.

Q: How do you handle edge cases?
A: Design for the happy path first, then handle errors gracefully. Empty states, loading states, error states all need design. Edge cases are where products feel broken or polished.

Q: What's your approach to onboarding?
A: Get users to value fast. Don't tour every feature - show them the one thing that matters most. Progressive disclosure. Empty state design is onboarding design.

=====================================
SPECIFIC SCENARIOS & SITUATIONS (15 QUESTIONS)
=====================================

Q: How would you improve our product? (generic company)
A: I'd need to understand your metrics first - what are you trying to improve? Conversion? Retention? Then I'd talk to users about their pain points. Without that context, any redesign is just cosmetic.

Q: What would you do in your first 30 days?
A: Weeks 1-2: Learn the product, talk to users, review analytics, understand metrics. Weeks 3-4: Identify quick wins and longer-term opportunities, align with stakeholders on priorities. Ship something small by day 30.

Q: How would you handle a tight deadline?
A: Ship MVP, cut scope ruthlessly. Focus on the 20% that drives 80% of value. Collaborate closely with engineering on what's feasible. Iterate after launch rather than perfect before launch.

Q: What if stakeholders disagree with your design?
A: Show them the data - user research, analytics, competitive analysis. If they still disagree, propose A/B testing to let users decide. Data usually resolves disagreements.

Q: How would you design for a new market/country?
A: Research local behaviors and expectations first. Don't assume Western patterns work everywhere. Localize properly - not just translation, but cultural adaptation. Test with local users.

Q: What if users aren't using a feature you designed?
A: Check analytics - is it discoverable? Is it solving the right problem? Talk to users - why aren't they using it? Then either fix the design, improve discovery, or kill the feature.

Q: How do you handle legacy technical debt?
A: Incremental improvement. Can't rebuild everything at once. Identify highest-impact areas, establish new patterns, gradually migrate old to new. That's how design systems work.

Q: What if you don't have time for research?
A: Find time. Even 5 quick user interviews are better than assumptions. Scrappy research > no research. Review support tickets, watch session recordings, check analytics - something is better than nothing.

Q: How would you redesign a failing product?
A: First, understand why it's failing - is it the product itself, marketing, execution? Then decide if it needs redesign or repositioning. Sometimes products fail for non-design reasons.

Q: What if engineering says your design is impossible?
A: Listen first - they might be right. Then explore alternatives together. If it's truly critical, find a simplified version that's feasible. Collaborate, don't dictate.

Q: How do you handle feature requests from sales?
A: Validate with actual users first. Sales talks to prospects, not active users. If it's a common objection blocking deals, prioritize it. If it's one prospect's pet request, probably not.

Q: What if analytics contradict user feedback?
A: Dig deeper. What users say vs what they do often differs. Watch session recordings, run usability tests. Usually both are true in different contexts.

Q: How would you fix a low conversion rate?
A: Funnel analysis first - where are users dropping off? Then hypothesis: is it trust, clarity, friction, value prop? Test solutions starting with biggest drop-off points.

Q: What if the CEO wants to change everything?
A: Understand their concerns, show current performance data, propose testing changes rather than wholesale redesign. CEOs usually care about outcomes - show them the impact path.

Q: How do you handle scope creep mid-project?
A: Document it clearly, communicate impact on timeline/quality, get explicit prioritization. If scope increases, something else has to give - make trade-offs visible.

=====================================
INDUSTRY & TRENDS (10 QUESTIONS)
=====================================

Q: What do you think about AI in design?
A: It's already here and it's transformative. I use Claude and ChatGPT daily - for research, critique, content, even code. Designers who ignore AI will be left behind. But AI generates, humans curate and decide.

Q: Will AI replace designers?
A: No, but designers who use AI will replace designers who don't. AI handles the boring stuff - I use it to move 10x faster. The strategic thinking, taste, and judgment? Still human.

Q: What do you think about no-code tools?
A: Great for simple stuff and MVPs. But complex products still need custom design and development. I use no-code for quick prototypes sometimes.

Q: What's the future of design systems?
A: More automated, more AI-assisted. Design tokens will become industry standard. Systems will generate code automatically. The manual maintenance will decrease, strategic thinking will increase.

Q: What design trends are you following?
A: Honestly, I ignore trends. I care about what works - good typography, clear hierarchy, fast performance, accessible design. Trends are noise. Fundamentals are forever.

Q: What's your take on Web3/crypto design?
A: Interesting problems - trust, complexity, new mental models. But most crypto products have terrible UX. Huge opportunity for designers who can make complex things simple.

Q: What do you think about design on mobile vs desktop?
A: Mobile-first is table stakes now. 60-70% of traffic is mobile for most products. If you're not designing mobile-first, you're designing for the minority.

Q: What's the biggest challenge in design right now?
A: Making AI products understandable and trustworthy. Also, designing for accessibility and inclusion is still treated as optional by too many companies.

Q: Where do you see product design in 5 years?
A: More AI-assisted, more code-generation, more automation of repetitive tasks. Designers will focus more on strategy and less on pixel-pushing. Design-dev boundaries will blur.

Q: What's your opinion on design education?
A: Most design schools are behind industry. They teach tools and theory but not business thinking or collaboration. Self-taught designers with real project experience often outperform fresh grads.

=====================================
COMPENSATION & LOGISTICS (10 QUESTIONS)
=====================================

Q: What's your current salary?
A: I prefer not to share current salary. I'm looking for €60-80K+ depending on role scope, equity, benefits, and growth opportunity. Open to discussing total compensation package.

Q: What are your salary expectations?
A: €60-80K base for senior IC role in Madrid, €70-90K for lead/principal role, more for management. Flexible based on equity, benefits, remote flexibility, and growth potential.

Q: Are you willing to take a pay cut?
A: Depends on the opportunity. For the right company with strong equity and growth potential, I'd consider it. But I need to see the upside clearly.

Q: Do you prefer equity or cash?
A: Both. Fair market-rate cash + meaningful equity (0.5-2% for early employee at startup). I want compensation aligned with company success.

Q: What benefits matter to you?
A: Remote flexibility, learning budget, good health insurance, equipment budget, and growth opportunities. Less about perks like snacks, more about support for good work.

Q: Can you start immediately?
A: Usually 1 month notice period. Flexible based on current projects and transition needs. Want to leave AILY Labs in good shape, not burn bridges.

Q: Are you interviewing with other companies?
A: I'm exploring options. Looking for the right fit - great team, challenging problems, place where design drives strategy. Happy to discuss timelines if there's mutual interest.

Q: What's your ideal company size?
A: 20-200 people sweet spot. Small enough to have impact, large enough to have resources. Post-Series A, pre-IPO usually. Startup energy with some stability.

Q: Do you need visa sponsorship?
A: No, I'm Spanish/EU citizen. Can work anywhere in EU without sponsorship. Would need sponsorship for US/UK roles but open to it for right opportunity.

Q: What's your work authorization?
A: EU citizen, Spanish passport. Can work anywhere in European Union immediately. Open to visa sponsorship for exceptional opportunities outside EU.

=====================================
PERSONAL WORK STYLE (10 QUESTIONS)
=====================================

Q: Are you an introvert or extrovert?
A: Ambivert probably. I enjoy collaboration and workshops but need focused solo time for deep work. Comfortable presenting to 50 people or working alone for hours.

Q: How do you handle stress?
A: Prioritize ruthlessly, communicate clearly, and focus on what I can control. Also, I use AI tools to eliminate boring tasks that create unnecessary stress.

Q: What's your ideal work schedule?
A: Flexible start (9-10am), core hours for collaboration (11am-4pm), deep work time (early morning or late afternoon). Async when possible, sync when needed.

Q: Do you prefer working from home or office?
A: Hybrid ideal. Office 2-3 days for collaboration, home 2-3 days for focused work. Fully remote works too if team is distributed. Forced full-time office? Less ideal.

Q: How do you stay productive?
A: Time blocking, focused work sessions, minimal meetings. I use AI to handle repetitive tasks. Also, I batch similar tasks together - design reviews in one block, research in another.

Q: What motivates you day-to-day?
A: Shipping features, seeing metrics improve, solving hard problems. I love the moment when a complex design just clicks and makes sense. Also, making teammates' lives easier.

Q: How do you handle boring tasks?
A: Automate with AI when possible. Batch them together. Do them early when energy is high. Or honestly, sometimes I just push through - not everything is exciting.

Q: What's your meeting philosophy?
A: Every meeting should have a goal and outcome. No agenda? No meeting. Most meetings could be emails or async updates. Protect maker time ruthlessly.

Q: How do you learn new skills?
A: Learn by doing. Take on projects slightly beyond my comfort zone. Also, YouTube, documentation, AI assistants. Formal courses are slow - I prefer practical application.

Q: What's your work-life balance like?
A: I work hard during work hours, then disconnect. No weekend work unless it's crunch time. Sustainable pace > burnout. Good work comes from rested minds.

=====================================
LEADERSHIP & MANAGEMENT (10 QUESTIONS)
=====================================

Q: Have you managed people before?
A: Project leadership and mentoring, not formal people management yet. Led the Adidas mobile team, mentored junior designers, ran cross-functional workshops. Ready for formal management.

Q: What's your management philosophy?
A: Hire smart people, give them context and autonomy, get out of their way. Regular 1:1s, clear goals, transparent feedback. Manage outcomes, not activities.

Q: How would you build a design team?
A: Hire for complementary skills - systems thinker, visual designer, researcher. Start lean (2-3), grow as needed. Prioritize collaboration and business thinking over pure craft.

Q: How do you give feedback?
A: Direct but kind. Specific examples, focus on impact, offer suggestions. Feedback sandwich is patronizing - just be honest. "This works because X, this doesn't work because Y, try Z instead."

Q: How do you receive feedback?
A: Openly. I ask clarifying questions, separate useful signal from noise, then act on it. Not defensive - feedback makes work better.

Q: What's your hiring process?
A: Portfolio review → phone screen → design exercise (realistic, paid) → team interview → culture fit. Look for business thinking, craft skills, collaboration ability, and growth mindset.

Q: How would you structure a design team?
A: Depends on product - could be feature teams (1 designer per squad) or centralized (design team supporting multiple products). Prefer embedded but with design team connection.

Q: What's your approach to design critiques?
A: Regular cadence, psychological safety, focus on solutions not problems. Everyone presents, everyone gives feedback. Critique the work, not the person.

Q: How do you mentor designers?
A: Pair on actual work, not theoretical exercises. Review their work with constructive feedback, share my decision-making process, give them stretchy projects with support.

Q: What makes a good design leader?
A: Strategic thinking, ability to say no, focus on outcomes, makes team better. Good leaders make designers more productive and more valuable to the business.

=====================================
FAILURES & LEARNINGS (10 QUESTIONS)
=====================================

Q: What's your biggest design mistake?
A: Designed a feature based on assumptions without user validation. It flopped. Learned to always research first, even quick and dirty research is better than assumptions.

Q: Tell me about a project that failed.
A: Early in my career, redesigned a dashboard without understanding user workflows. Beautiful but unusable for actual work. Learned that pretty ≠ useful.

Q: What would you do differently?
A: Start doing user research earlier. My first few years I relied too much on best practices and assumptions. Now I interview 15-25+ users minimum per project.

Q: What's a feature you designed that didn't work?
A: Designed a complex filtering system that was powerful but confusing. Users didn't understand it. Learned to start simple, add complexity only when users ask for it.

Q: Have you ever missed a deadline?
A: Yes, on a project where scope kept changing. Learned to document scope changes clearly and communicate impact on timeline immediately, not just absorb everything.

Q: What's something you're not good at?
A: Illustration and icon design. I'm functional, not artistic. I know when to hire an illustrator vs do it myself. Also, I'm impatient with slow-moving organizations.

Q: What feedback do you get most often?
A: "You move too fast." I sometimes need to slow down and bring everyone along rather than charging ahead. Working on balancing speed with inclusivity.

Q: Have you ever had a project canceled?
A: Yes. Spent 2 months on a feature that got deprioritized when strategy changed. Learned to validate strategic alignment before deep work, not after.

Q: What's your worst client experience?
A: Client who wanted to design by committee - 15 stakeholders all with opinions, no decision maker. Learned to identify clear decision makers upfront or walk away.

Q: What would you warn someone about you?
A: I move fast and can be impatient with process for process sake. I push for action over endless discussion. Some teams appreciate it, some teams find it intense.

=====================================
SPECIFIC ROLE QUESTIONS (15 QUESTIONS)
=====================================

Q: Why this company specifically?
A: [Customize] I'm interested in [specific challenge they face], the opportunity to [specific work], and [specific thing about their mission/product]. Plus [team/culture fit reason].

Q: Why leave your current role?
A: AILY Labs is great for learning AI product design, but I'm looking for [more scope/larger team/specific challenge]. Ready for the next level of impact and responsibility.

Q: What interests you about [specific industry]?
A: [For fintech] Banking is ripe for disruption - most experiences are terrible. [For B2B SaaS] Love making complex tools simple. [For healthtech] High impact, life-changing potential.

Q: How would you approach our specific problem?
A: First, I'd need to understand your metrics and user pain points. Then I'd [specific approach based on their problem]. But honestly, I'd need more context to give you a real answer.

Q: What do you know about our product?
A: [Research their product first] I see you're solving [problem]. Interesting approach with [specific feature]. Curious about [specific question based on their product].

Q: How do you fit with our company values?
A: [Research their values] Your focus on [value 1] aligns with my [specific example]. I also appreciate [value 2] because [reason from my experience].

Q: What would you want to work on here?
A: Based on what I've seen, [specific feature/problem] seems like a big opportunity. Also interested in [design system/specific initiative] if that's on the roadmap.

Q: How would you work with our CEO?
A: Same way I've worked with executives before - understand their goals, communicate in business language (metrics, outcomes), bring solutions not just problems. Regular updates, no surprises.

Q: What concerns do you have about this role?
A: [Be honest] I'd want to understand [scope/resources/support] better. Also curious about [specific concern]. These aren't dealbreakers, just things to discuss.

Q: What questions do you have about the role?
A: What does success look like in the first 6 months? What's the biggest design challenge right now? How does design influence product decisions? What's the career path?

Q: How soon can you start?
A: 1 month notice typically, potentially sooner depending on current project state. We can discuss specific timing once we're aligned on the opportunity.

Q: What's your ideal team structure?
A: Depends on company size. For startup: 1 designer + PM + 2-3 engineers. For scale-up: embedded designers in squads with design team connection. Need both autonomy and collaboration.

Q: How hands-on do you want to be?
A: Very hands-on. Even if managing, I want to design key flows and maintain craft. Pure people management with no craft isn't interesting to me.

Q: What level role are you looking for?
A: Senior/Lead IC or Design Manager. Ready to level up from current role. Want mix of hands-on work and team/strategic leadership.

Q: What makes you interested in us vs other companies?
A: [Be specific] The combination of [specific thing about their product/mission], [team quality], and [growth stage] is compelling. Seems like right time to join and have real impact.
`;

  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const blocks = QA_TEXT.split(/\n(?=Q: )/g)
    .map((block) => block.trim())
    .filter((block) => block.startsWith("Q:"));

  const qaPairs = blocks
    .map((block) => {
      const qMatch = block.match(/^Q:\s*(.+)$/m);
      const aMatch = block.match(/^A:\s*([\s\S]+)$/m);
      if (!qMatch || !aMatch) return null;
      const question = qMatch[1].trim();
      const answer = aMatch[1].trim();
      return {
        question,
        answer,
        normalizedQuestion: normalize(question),
        normalizedAnswer: normalize(answer),
      };
    })
    .filter(Boolean);

  window.JAIME_QA = qaPairs;
})();

