#!/usr/bin/env python3
"""
TotWise Lab -- Phase 7 Builder
Generates Month 3 (Body & Movement), Month 4 (Feelings & Faces),
Month 5 (Hands & Making), Month 6 (Pretend & Story).
Each month: 30 activity HTML pages + 30 worksheet HTML pages.
"""
import os

BASE = "/Users/sandiprath/Documents/Projects/TotWise_Lab/frontend/server/public"

# ---------------------------------------------------------------------------
# CURRICULUM DATA  (no em-dashes, no curly quotes -- plain ASCII safe)
# ---------------------------------------------------------------------------

MONTHS = {
    3: {
        "name": "Body & Movement",
        "toolkit_label": "2--3 Years &middot; Month 3",
        "weeks": {
            1: {"title": "Big Moves", "subtitle": "Jumping, running, and first gross motor confidence"},
            2: {"title": "Balance &amp; Coordination", "subtitle": "The body learning to work as a team"},
            3: {"title": "Body Awareness", "subtitle": "Knowing where you are in space"},
            4: {"title": "Moving Together", "subtitle": "When two bodies play as one"},
        },
        "days": {
            1:  {"title":"Jump! Jump! Jump!", "emoji":"🦘", "skill":"Gross Motor",   "materials":"Open floor space",
                 "milestone":"Milestone: Jumping with both feet leaving the ground together emerges around 24 months. It requires coordination of leg muscles, balance, and timing -- a genuine physical achievement that builds confidence and core strength.",
                 "setup":["Stand facing each other with a little space to jump","Make sure the floor is clear and safe"],
                 "play":["Bend your knees and say 'Ready, set, JUMP!' together","Jump in place -- encourage your child to copy","Try 3 jumps, 5 jumps, count together","Make it silly: tiny jumps, big jumps, quiet jumps"],
                 "say":['"Ready? Jump with me!"','"1, 2, 3 -- jump!"','"Look at your jumping feet!"'],
                 "if_happens":"Child watches but won't jump yet",
                 "avoid":"'You have to try -- jump!'",
                 "better":'"I love watching. I will jump, you watch -- maybe you will join me."',
                 "why":"Jumping requires bilateral coordination -- both sides of the brain communicating in real time. At 2 years, this skill is still developing and not all children are ready simultaneously. Observing and then attempting is a valid and important learning stage. The playful invitation without pressure activates intrinsic motivation far more effectively than prompting.",
                 "tool":"Name the Effort",
                 "phrases":['"Your legs did that!"', '"You tried and that took courage."'],
                 "skills":"Gross motor development, bilateral coordination, physical confidence."},
            2:  {"title":"Run and Freeze", "emoji":"🏃", "skill":"Body Control",   "materials":"Open space",
                 "milestone":"Milestone: Starting and stopping on command at age 2-3 builds inhibitory control -- the foundation of self-regulation. Children who practise stop-and-start games show better attention in later years.",
                 "setup":["Clear a safe running area","You will be the 'caller'"],
                 "play":["Say 'Go!' and run together (slowly)","Say 'Freeze!' and stop completely -- make it dramatic","Try clapping instead of words after a few rounds","Giggle together and repeat 5-6 times"],
                 "say":['"GO GO GO!"','"FREEZE! Like a statue!"','"You stopped SO fast!"'],
                 "if_happens":"Child keeps running after Freeze",
                 "avoid":'"Stop -- I said STOP!"',
                 "better":'"Ohh I am still frozen -- can you freeze with me? Like this..."',
                 "why":"The stop-start nature of this game directly trains inhibitory control -- the ability to suppress an ongoing action on demand. This is one of the executive functions that most powerfully predicts school readiness. At 2-3 years, the prefrontal cortex is in a critical growth period, and games like Freeze build the neural pathways for self-control in a joyful, low-stakes context.",
                 "tool":"Calm Body Check",
                 "phrases":['"Frozen body, calm breathing."', '"Still like a tree."'],
                 "skills":"Inhibitory control, body awareness, listening skills."},
            3:  {"title":"Marching Band", "emoji":"🥁", "skill":"Rhythm",          "materials":"Two wooden spoons or pots",
                 "milestone":"Milestone: Marching in rhythm -- alternating legs while keeping time -- involves bilateral motor sequencing that supports both musical development and pre-writing skills.",
                 "setup":["Give your child a pot and wooden spoon (or just clap)","Stand side by side"],
                 "play":["Start a slow march -- left, right, left, right","Beat the pot in rhythm with your steps","Try humming a simple marching tune","March around the room together"],
                 "say":['"Left foot, right foot -- like a soldier!"','"Listen to the beat!"','"We are a band -- you and me!"'],
                 "if_happens":"Child bangs randomly with no rhythm",
                 "avoid":'"No, like this -- in time with me."',
                 "better":'"Yes! You are banging! Let me bang with you -- listen for the match."',
                 "why":"Rhythmic entrainment -- the ability to synchronize movement with an external beat -- is a uniquely human capacity that appears in rudimentary form at age 2. Research shows that children who engage in rhythmic activities show stronger phonological awareness later, because rhythm and language share neural architecture. Even imperfect marching builds the timing circuits that reading will later use.",
                 "tool":"Sound Body Scan",
                 "phrases":['"Can you feel the beat in your feet?"', '"Thump thump -- your heart has a beat too."'],
                 "skills":"Gross motor rhythm, bilateral coordination, early musical literacy."},
            4:  {"title":"Hop on One Foot", "emoji":"🐸", "skill":"Balance",        "materials":"None",
                 "milestone":"Milestone: Hopping on one foot is a developmental milestone typically achieved between 2.5 and 3.5 years. It requires single-leg balance, which is critical for stair-climbing, running, and sports participation.",
                 "setup":["Stand facing each other","Demonstrate holding one foot up first"],
                 "play":["Hold one foot up -- 'Like a flamingo!'","Try to balance -- 1 second, 2 seconds","Try a small hop -- even one hop counts","Celebrate every attempt: 'You did it!'"],
                 "say":['"Can you be a flamingo with me?"','"Hold your foot up -- how long can you balance?"','"One hop! Amazing!"'],
                 "if_happens":"Child topples immediately and gets frustrated",
                 "avoid":'"Try harder -- hold it for longer."',
                 "better":'"It is really hard -- I fall too! Let us try together holding the wall."',
                 "why":"Single-leg balance activates proprioceptive pathways -- the body's internal sense of position. At 2-3 years, the vestibular system (balance) and proprioceptive system are rapidly developing. Providing a wall to hold reduces frustration while still providing the balance challenge. Gradual withdrawal of support is a key principle of motor scaffolding.",
                 "tool":"Wobble and Laugh",
                 "phrases":['"Wobbling is just practising balance."', '"Every wobble teaches your body something."'],
                 "skills":"Single-leg balance, proprioception, frustration tolerance."},
            5:  {"title":"Animal Walks", "emoji":"🐻", "skill":"Gross Motor",       "materials":"Open floor space",
                 "milestone":"Milestone: Imitating animal movements requires motor planning -- the ability to sequence novel movements. This skill underpins dressing, drawing, and eventually writing.",
                 "setup":["Clear the floor","Choose 3-4 animals together"],
                 "play":["Bear walk: walk on hands and feet","Bunny hop: crouch and jump forward","Crab walk: hands and feet, tummy up","Frog: crouch, jump, say 'Ribbit!'"],
                 "say":['"Which animal are we doing?"','"Stomp stomp -- big bear!"','"Ribbit ribbit! You are a frog!"'],
                 "if_happens":"Child only wants to do one animal repeatedly",
                 "avoid":'"Let us do the others now -- come on."',
                 "better":'"Yes! You love the bear! I will be the bunny -- can the bear catch the bunny?"',
                 "why":"Animal walks engage the full kinetic chain -- coordinating shoulders, core, hips, and limbs simultaneously. This kind of cross-lateral movement (using opposite arm and leg together) is specifically important for integrating the two brain hemispheres. The narrative element (being an animal) increases motivation and maintains focus through the physical challenge.",
                 "tool":"Name the Body Hero",
                 "phrases":['"Your strong arms carried your whole body!"', '"Bear legs -- so powerful!"'],
                 "skills":"Motor planning, cross-lateral movement, imaginative play."},
            6:  {"title":"Rolling Like a Log", "emoji":"🪵", "skill":"Core Strength", "materials":"Soft rug or mat",
                 "milestone":"Milestone: Log rolling develops core strength, vestibular processing, and body-midline crossing -- three foundational skills for sitting, writing, and reading.",
                 "setup":["Lay out a mat or soft area","Lie down side by side"],
                 "play":["Stretch arms overhead -- lie straight like a log","Roll slowly sideways across the mat","Try rolling back the other way","Giggle! Get dizzy! That is the point."],
                 "say":['"Arms up -- straight as a log!"','"Rolling, rolling, rolling..."','"That was dizzy! I can feel it too."'],
                 "if_happens":"Child rolls too fast and hits something",
                 "avoid":'"Slow down -- you will hurt yourself."',
                 "better":'"Slow log! Like a log in a river -- easy and slow. Show me your slow roll."',
                 "why":"Vestibular stimulation through rolling activates the inner ear's gravity receptors, helping the brain map its relationship to the ground and develop spatial orientation. Research in sensory integration shows that children who receive adequate vestibular input develop better balance, attention, and even emotional regulation -- because the vestibular system connects directly to arousal centres in the brainstem.",
                 "tool":"Ground and Breathe",
                 "phrases":['"Feel the floor under you."', '"Breathe slowly -- feel your tummy rise."'],
                 "skills":"Core strength, vestibular processing, spatial orientation."},
            7:  "reflection",
            8:  {"title":"Tightrope Walk", "emoji":"🎪", "skill":"Balance",          "materials":"Tape or a scarf on the floor",
                 "milestone":"Milestone: Walking heel-to-toe along a line develops dynamic balance and visual-motor integration. Children who practise balance beam activities show improved core stability and handwriting readiness.",
                 "setup":["Put tape in a straight line on the floor (or use a scarf)","Stand at one end together"],
                 "play":["Walk slowly along the line, heel to toe","Arms out for balance","Try walking backward","Try eyes closed for one step"],
                 "say":['"Arms out -- like a tightrope walker!"','"Heel... toe... heel... toe..."','"You made it all the way!"'],
                 "if_happens":"Child steps off the line and stops trying",
                 "avoid":'"You have to stay on the line."',
                 "better":'"You stepped off and got back on -- that is the hardest skill of all!"',
                 "why":"Dynamic balance challenges -- walking a line, stepping over obstacles -- train the cerebellum and vestibular system to predict and correct body position in real time. The heel-to-toe gait pattern is also a prerequisite for mature running and stair descent. Studies show that balance training at age 2-3 has lasting effects on gross motor competence.",
                 "tool":"Find Your Balance Breath",
                 "phrases":['"Breathe out slowly -- your body finds its balance."', '"Slow and steady."'],
                 "skills":"Dynamic balance, visual-motor integration, focus."},
            9:  {"title":"Throw and Catch", "emoji":"🎾", "skill":"Hand-Eye Coordination", "materials":"A soft ball or rolled sock",
                 "milestone":"Milestone: Catching a thrown ball requires anticipatory motor control -- the brain predicting where the ball will be and moving hands to meet it. This skill develops between 2 and 4 years and is closely linked to reading tracking skills.",
                 "setup":["Sit close together on the floor (1-2 feet apart)","Use a large soft ball"],
                 "play":["Roll the ball first -- easier than throwing","Graduate to gentle underhand tosses","Move further apart as skill develops","Celebrate every catch and every attempt"],
                 "say":['"Watch the ball -- here it comes!"','"Hands ready -- open them wide!"','"You caught it! Your eyes told your hands!"'],
                 "if_happens":"Ball keeps bouncing away and child gets frustrated",
                 "avoid":'"Pay attention -- watch the ball."',
                 "better":'"Tricky ball! Let us sit even closer -- almost touching. Now try."',
                 "why":"Catching requires the visual system to track a moving object and the motor system to predict its trajectory -- called anticipatory motor control. This cross-system integration is foundational for reading (tracking text) and writing (guiding pencil). Starting close reduces failure and maintains the confidence needed for continued practice.",
                 "tool":"Steady Eyes, Ready Hands",
                 "phrases":['"Eyes on the ball -- your hands will follow."', '"You tracked it all the way!"'],
                 "skills":"Hand-eye coordination, tracking, anticipatory motor control."},
            10: {"title":"Kick the Ball", "emoji":"⚽", "skill":"Leg Coordination",  "materials":"A soft ball",
                 "milestone":"Milestone: Kicking a stationary ball requires shifting weight to one leg while extending the other -- a coordination challenge that builds the single-leg balance used in all future sports.",
                 "setup":["Place a ball on the floor","Stand a little away from it"],
                 "play":["Walk up and kick gently -- no running first","Try the other foot","Set up a 'goal' (two shoes apart)","Take turns kicking"],
                 "say":['"Big kick -- go, ball, go!"','"Now the other foot!"','"GOAL! You scored!"'],
                 "if_happens":"Child misses the ball and kicks air",
                 "avoid":'"You missed -- look at the ball."',
                 "better":'"Ha! I miss too! The ball is tricky. Try again -- take a big step first."',
                 "why":"Weight transfer during kicking is a complex motor task requiring the brain to anticipate body displacement while maintaining upright posture. Missing and recovering is developmentally normal and actually essential -- each miss gives the brain corrective feedback that refines the motor program for next time. Celebrating attempts rather than outcomes protects the motivation needed to keep practising.",
                 "tool":"Try Again Talk",
                 "phrases":['"Missing is how you learn to hit it."', '"Every kick teaches your leg something."'],
                 "skills":"Leg coordination, weight transfer, persistence."},
            11: {"title":"Stepping Stones", "emoji":"🪨", "skill":"Spatial Reasoning", "materials":"Cushions, books, or coloured paper",
                 "milestone":"Milestone: Stepping over and onto objects develops spatial reasoning -- understanding how your body relates to objects in space. This skill is foundational for geometry, map-reading, and everyday navigation.",
                 "setup":["Place cushions or flat items on the floor","Create a simple path"],
                 "play":["Step from stone to stone without touching the floor","Make it a game: 'The floor is lava!'","Try stepping over gaps","Change the spacing to vary the challenge"],
                 "say":['"Step on the stone -- not the lava!"','"Big step -- can you reach?"','"You made it all the way across!"'],
                 "if_happens":"Child jumps off the path after one stone",
                 "avoid":'"Stay on the path."',
                 "better":'"Lava got you! Quick, start again -- the stones are waiting!"',
                 "why":"Navigating an irregular path requires real-time spatial calculation -- the child must judge distances, adjust step length, and maintain balance with each new stone. Research shows floor-is-lava and stepping stone games develop spatial cognition that later transfers to mathematics and reading comprehension (following a text path). The narrative element also sustains engagement longer than simple balance tasks.",
                 "tool":"Body in Space",
                 "phrases":['"How far is that stone? Does your leg reach?"', '"Your body is mapping the space."'],
                 "skills":"Spatial reasoning, step calibration, balance."},
            12: {"title":"Spin and Stop", "emoji":"🌀", "skill":"Vestibular Processing", "materials":"Open space",
                 "milestone":"Milestone: Spinning and voluntarily stopping requires the vestibular system (inner ear) to rapidly recalibrate. Children who regularly seek spinning sensory input are developing their sense of balance and position in space.",
                 "setup":["Stand in an open area","Demonstrate first"],
                 "play":["Spin slowly 2-3 times -- then stop","See how dizzy you both get -- giggle together","Try 1 spin vs 3 spins -- which is dizzier?","Spin, stop, balance on one foot"],
                 "say":['"Spinning! Round and round!"','"STOP! How dizzy?"','"The world is still moving -- wait for it to stop."'],
                 "if_happens":"Child spins endlessly and cannot stop",
                 "avoid":'"Stop spinning now -- that is enough."',
                 "better":'"Let us spin together and stop at the same time -- ready? 3, 2, 1, STOP!"',
                 "why":"Some children seek intense vestibular input because their nervous system needs more of it to achieve a regulated state. This is normal sensory-seeking behaviour. Spinning activates the semicircular canals of the inner ear and the resulting nystagmus (eye movement) actually helps calibrate the visual-vestibular system. Providing structured spinning with clear stops teaches the nervous system to both seek and regulate vestibular input.",
                 "tool":"The Dizzy Breath",
                 "phrases":['"Big breath -- let the dizzy settle."', '"Your body is finding its balance again."'],
                 "skills":"Vestibular processing, sensory regulation, stop-start control."},
            13: {"title":"Heavy Work Carry", "emoji":"🧱", "skill":"Proprioception",  "materials":"A small backpack with books or a light grocery bag",
                 "milestone":"Milestone: Carrying weight provides proprioceptive input -- deep pressure through joints and muscles. This type of input is calming, organising, and builds body awareness, especially for children who feel unsettled.",
                 "setup":["Pack a light backpack (1-2 kg maximum)","Make it a special job"],
                 "play":["Give your child the backpack as a 'special delivery'","Walk together to a destination (another room)","Unload it together and celebrate","Try carrying items two-handed too"],
                 "say":['"You are so strong -- this is a big job."','"Heavy things make our muscles wake up."','"Delivery delivered! You did it!"'],
                 "if_happens":"Child drops it and says it is too heavy",
                 "avoid":'"It is not that heavy -- you can do it."',
                 "better":'"Too heavy! Lets lighten the load together -- what can we take out?"',
                 "why":"Heavy work activities provide proprioceptive input -- sensory feedback from muscles and joints -- that has a remarkably calming effect on the nervous system. The proprioceptive system is sometimes called the hidden sense and is closely linked to emotional regulation. Children who are dysregulated or overexcited often benefit from carrying, pushing, or pulling activities because they provide organizing sensory input.",
                 "tool":"Strong and Calm",
                 "phrases":['"Strong arms, calm body."', '"Heavy work is like a hug for your nervous system."'],
                 "skills":"Proprioception, strength, body awareness, emotional regulation."},
            14: "reflection",
            15: {"title":"Head Shoulders Knees", "emoji":"🙆", "skill":"Body Parts + Sequencing", "materials":"None",
                 "milestone":"Milestone: The Head, Shoulders, Knees and Toes song builds body vocabulary, sequencing (doing things in order), and listening comprehension simultaneously -- combining motor and cognitive development.",
                 "setup":["Stand facing each other","Start slowly -- speed up later"],
                 "play":["Sing and touch: head, shoulders, knees, toes","Then add: eyes and ears and mouth and nose","Speed up each round","Try backward order for a challenge"],
                 "say":['"Touch your head -- can you find it?"','"Faster! Head... shoulders... KNEES!"','"You know all your parts!"'],
                 "if_happens":"Child gets ahead and touches wrong parts",
                 "avoid":'"Wait -- it is shoulders, not toes yet."',
                 "better":'"Ha! You went ahead of me -- fast mover! Let me catch up. Again!"',
                 "why":"Action songs that pair words with body movements create multi-modal memory traces -- the word, the motion, and the song melody are encoded together. This redundancy makes vocabulary retention significantly stronger than verbal-only instruction. The sequencing component also builds working memory as children must remember what comes next while executing the current action.",
                 "tool":"Moving and Learning",
                 "phrases":['"When your body moves, your brain learns better."', '"Hands remember words too."'],
                 "skills":"Body vocabulary, sequencing, working memory, coordination."},
            16: {"title":"Fast and Slow", "emoji":"🐢", "skill":"Speed Modulation",  "materials":"Music (optional)",
                 "milestone":"Milestone: Modulating movement speed requires conscious control of motor impulses -- a key component of self-regulation. Practising fast/slow transitions builds the neural pathways for emotional pacing too.",
                 "setup":["Open space","Optional: slow music and fast music"],
                 "play":["Walk in slow motion together","Then run fast (safely)","Switch between fast and slow on command","Try talking fast and slow too"],
                 "say":['"S-l-o-w m-o-t-i-o-n..."','"FAST FAST FAST!"','"Your body knows two speeds!"'],
                 "if_happens":"Child only wants to go fast",
                 "avoid":'"Slow down now."',
                 "better":'"Challenge: can you go SO slow I cannot see you moving? Even slower than that..."',
                 "why":"Speed modulation practise activates the motor cortex's inhibitory circuits -- the same circuits used to control emotional expression. Research shows that children who practise stopping and slowing physical actions develop better emotional regulation, because the 'brake' on movement and the 'brake' on emotion share overlapping neural architecture. Slow-motion is particularly powerful because it requires sustained inhibitory effort.",
                 "tool":"The Slow Breath Brake",
                 "phrases":['"Slow breath -- slow body -- slow feelings."', '"Your body has a speed dial."'],
                 "skills":"Speed modulation, inhibitory control, self-regulation."},
            17: {"title":"Big and Tiny Moves", "emoji":"🐘", "skill":"Force Modulation", "materials":"None",
                 "milestone":"Milestone: Learning to use gentle versus strong force is essential for social play (gentle touch), art (light vs heavy pencil), and emotional regulation (channelling strong feelings into appropriate actions).",
                 "setup":["Stand together with space to move"],
                 "play":["Stomp like an elephant -- BIG and LOUD","Tiptoe like a mouse -- tiny and quiet","Giant claps versus finger taps","Giant hugs versus air kisses"],
                 "say":['"STOMP STOMP -- elephant coming!"','"Shh... tiny mouse tiptoes..."','"You can be big AND tiny!"'],
                 "if_happens":"Child only wants to stomp and knock things over",
                 "avoid":'"Be careful -- that is too rough."',
                 "better":'"Save the stomping for elephant time -- tiny mouse is next. Ready to be the mouse?"',
                 "why":"Force modulation -- the ability to grade physical effort appropriately -- is regulated by the motor cortex's intensity circuits. This is the same neural system that governs emotional intensity, which is why children who practise gentle versus strong physical actions also show improvements in emotional regulation. The elephant-mouse contrast is especially effective because the animal personas provide a clear, memorable reference for each force level.",
                 "tool":"Gentle and Strong",
                 "phrases":['"Gentle hands, gentle voice."', '"You can choose your level of strong."'],
                 "skills":"Force modulation, sensory awareness, emotional intensity regulation."},
            18: {"title":"Copy My Move", "emoji":"🪞", "skill":"Motor Imitation",   "materials":"None",
                 "milestone":"Milestone: Motor imitation -- watching and replicating another person's movement -- is a primary mechanism of learning in the first three years. It activates mirror neurons and builds social cognition alongside motor skill.",
                 "setup":["Face each other","You start as the leader"],
                 "play":["Do a simple movement: pat your head","Child copies","Then swap -- they lead, you copy","Try increasingly complex sequences"],
                 "say":['"Can you do what I do?"','"Your turn to be the leader!"','"I am your mirror!"'],
                 "if_happens":"Child creates completely different movements instead of copying",
                 "avoid":'"Copy me -- do what I do."',
                 "better":'"Oh! You made your own move -- I will copy YOU. Look, now I am YOUR mirror!"',
                 "why":"Motor imitation engages the mirror neuron system -- neurons that fire both when you perform an action and when you observe someone else perform it. This system is fundamental to learning, empathy, and social bonding. When children lead and the parent imitates, it activates the child's awareness of their own intentional actions, building the metacognitive awareness that they can deliberately communicate through movement.",
                 "tool":"I See You Moving",
                 "phrases":['"I see exactly what you are doing -- your body is talking."', '"Your move said something to me."'],
                 "skills":"Motor imitation, social awareness, body communication."},
            19: {"title":"Move to the Music", "emoji":"🎵", "skill":"Rhythmic Movement", "materials":"Music (any kind)",
                 "milestone":"Milestone: Moving spontaneously to music integrates auditory processing with motor output -- a cross-sensory integration that strengthens both musical ability and language development.",
                 "setup":["Put on any music","Clear some space"],
                 "play":["Move however the music makes you feel","Fast music: fast dancing; slow music: slow swaying","Match the beat by clapping","Try instruments: clap, stomp, snap"],
                 "say":['"What does this music make your body want to do?"','"I feel like spinning -- do you?"','"Your body is making music!"'],
                 "if_happens":"Child is shy about dancing",
                 "avoid":'"Come on -- just dance, it is fun."',
                 "better":'"I am going to close my eyes and just move my fingers -- even that is dancing."',
                 "why":"Spontaneous movement to music activates the motor, auditory, and limbic (emotional) systems simultaneously. This multi-system activation produces neuroplasticity benefits beyond what any single activity can achieve. The key is removing performance pressure -- when children feel judged for how they dance, the self-consciousness activates the prefrontal cortex in ways that actually suppress the natural motor-musical integration.",
                 "tool":"Feel the Music",
                 "phrases":['"What colour is this music?"', '"How does this song feel in your chest?"'],
                 "skills":"Auditory-motor integration, creative expression, self-expression."},
            20: {"title":"Yoga Animals", "emoji":"🧘", "skill":"Flexibility + Body Awareness", "materials":"Mat or carpet (optional)",
                 "milestone":"Milestone: Simple yoga poses build flexibility, balance, and body schema -- the internal map of where your limbs are. They also introduce breath as a calming tool.",
                 "setup":["Lay out a mat if available","Choose 3 animals together"],
                 "play":["Cat: on hands and knees, arch back up","Dog: hands and feet, bottom up like a tent","Tree: one foot on ankle, arms as branches","Butterfly: sit, soles of feet together, wings flap"],
                 "say":['"We are cats -- meow and arch your back."','"Tree pose -- can you feel your roots?"','"Breathe in... breathe out... good."'],
                 "if_happens":"Child falls out of poses immediately",
                 "avoid":'"Hold it -- you are not trying."',
                 "better":'"Even one second is yoga! Every time you try is a practice."',
                 "why":"Yoga poses for toddlers develop proprioception, flexibility, and balance simultaneously. The breath cues -- breathe in, breathe out -- introduce somatic awareness at an early age, building the toolkit for future emotion regulation. Research shows that children who learn breath awareness before age 4 show stronger ability to use self-calming strategies in stressful situations.",
                 "tool":"Animal Breath",
                 "phrases":['"Breathe in like you smell flowers."', '"Breathe out like you are blowing bubbles."'],
                 "skills":"Flexibility, proprioception, breath awareness, body schema."},
            21: "reflection",
            22: {"title":"Follow the Leader", "emoji":"🚶", "skill":"Social Coordination", "materials":"None",
                 "milestone":"Milestone: Following a leader requires sustained attention, motor planning, and social attunement -- watching and responding to another's movements. Leading builds initiative and creative thinking.",
                 "setup":["Start in a line, one behind the other"],
                 "play":["Leader does movements -- follower copies","Try: walk funny, spin, tip-toe, jump","Swap: child leads, parent follows","Make a path around the room"],
                 "say":['"I am the leader -- copy everything I do!"','"Your turn to be leader -- I will do whatever you do!"','"You led me to the kitchen -- clever leader!"'],
                 "if_happens":"Child leads but then wants you to decide",
                 "avoid":'"No, you are the leader -- you decide."',
                 "better":'"Hmm, I will start with one idea -- then you can copy or change it. You are the boss."',
                 "why":"Follow the Leader alternates between two demanding cognitive modes: follower mode (observing and rapidly imitating) and leader mode (generating novel actions for someone else to do). Leader mode is especially valuable -- creating movement sequences for someone else to follow requires planning, sequencing, and audience awareness, all of which are executive function skills.",
                 "tool":"Watch and Copy",
                 "phrases":['"Your eyes are doing the work before your body."', '"I see your movement coming before you make it."'],
                 "skills":"Sustained attention, motor planning, social coordination."},
            23: {"title":"Push and Pull Together", "emoji":"⚓", "skill":"Cooperative Movement", "materials":"A rope, towel, or scarf",
                 "milestone":"Milestone: Cooperative physical activities -- where both people must adjust to each other's force -- build physical co-regulation, the body-based foundation of emotional co-regulation.",
                 "setup":["Sit on the floor facing each other","Hold both ends of a towel or rope"],
                 "play":["Both hold the towel and pull gently -- find the balance point","Tug-of-war: gentle version","Row row row your boat: pull and release alternately","Try standing up together from the floor using the rope"],
                 "say":['"Pull! Now let me pull -- can you feel the difference?"','"Row with me -- we have to go at the same time."','"We did that together -- neither of us could do it alone."'],
                 "if_happens":"Child yanks hard and does not regulate",
                 "avoid":'"Too hard -- be gentle."',
                 "better":'"Wow, that is strong! Now I want to feel your gentle pull -- show me your softest tug."',
                 "why":"Cooperative physical tasks where two bodies must attune to each other's force are uniquely valuable for co-regulation development. The physical feedback loop -- feeling the other person's tension through the rope -- provides real-time bodily information about mutual adjustment. This is a concrete, physical experience of the social coordination that emotional attunement requires.",
                 "tool":"Feel the Connection",
                 "phrases":['"We are connected -- I can feel you through the rope."', '"Your body and my body are working together."'],
                 "skills":"Cooperative movement, force regulation, physical co-regulation."},
            24: {"title":"Chase and Catch", "emoji":"🏃", "skill":"Social Play",    "materials":"Open space",
                 "milestone":"Milestone: Chase games develop speed, direction-changing, spatial awareness, and -- crucially -- the social language of pursuit and escape. They also teach consent: stopping when someone says stop.",
                 "setup":["Open safe space indoors or outdoors","Establish clear boundaries"],
                 "play":["Parent chases child (slowly) -- dramatic running","When child is caught: big hug, then release","Let child chase parent","Establish a safe base: a wall or cushion where no chasing"],
                 "say":['"I am going to catch you -- run!"','"I got you! Hug! Now I will run -- catch me!"','"Touch the safe base -- no chasing there!"'],
                 "if_happens":"Child panics when parent gets close (real fear, not play fear)",
                 "avoid":'"It is just a game -- I would not actually catch you!"',
                 "better":'"I can see that was a real scare -- let us stop. You can say STOP anytime and I will always stop."',
                 "why":"Chase games rehearse social boundary negotiation in a physical, joyful context. Teaching children that saying STOP ends the game immediately is an early, embodied consent lesson. Research shows children who engage in physically rough-and-tumble play with a trusted adult develop stronger social competence, because they are practising emotional risk-taking in a safe relationship.",
                 "tool":"Stop Means Stop",
                 "phrases":['"You said stop -- I stopped immediately."', '"Your words have power."'],
                 "skills":"Speed, spatial awareness, social play, early consent language."},
            25: {"title":"Row Row Row Together", "emoji":"🚣", "skill":"Cooperative Rhythm", "materials":"None (or a blanket)",
                 "milestone":"Milestone: Synchronized reciprocal movement -- like rowing -- requires both partners to predict and match each other's timing. This synchrony is a physical experience of deep social attunement.",
                 "setup":["Sit on the floor facing each other","Hold hands or a towel between you"],
                 "play":["Lean forward and back together in rhythm","Sing Row Row Row Your Boat","Speed up, slow down together","Try with eyes closed"],
                 "say":['"Forward... back... forward... back..."','"Row row row your boat... together!"','"We are in sync -- I can feel you!"'],
                 "if_happens":"Child does not match the rhythm",
                 "avoid":'"Wait for me -- go when I go."',
                 "better":'"Let me follow your rhythm -- you set the pace. I will match you."',
                 "why":"Movement synchrony -- two people moving in physical rhythm together -- produces measurable neurochemical changes: increased oxytocin and decreased cortisol. Studies show that infants and toddlers who experience synchronous physical play with caregivers develop stronger attachment, better emotional regulation, and more prosocial behaviour. The rowing metaphor also introduces the concept of mutual dependence.",
                 "tool":"Rhythm Together",
                 "phrases":['"When we move together, we feel closer."', '"Our bodies made the same rhythm."'],
                 "skills":"Cooperative rhythm, social synchrony, attachment."},
            26: {"title":"Obstacle Course Builder", "emoji":"🏗️", "skill":"Planning + Motor", "materials":"Cushions, chairs, tunnels (sheet over chairs)",
                 "milestone":"Milestone: Building and then navigating a self-made obstacle course develops planning, sequencing, and spatial cognition. Children who design their own physical challenges show stronger problem-solving development.",
                 "setup":["Gather cushions, chairs, blankets","Build it together"],
                 "play":["Design a course: crawl under, climb over, jump across","Build it together -- child decides layout","Run the course 3-4 times","Modify: add a section, change order"],
                 "say":['"Where should the tunnel go?"','"You built this -- now you are the first to run it!"','"Can we make it harder?"'],
                 "if_happens":"Child wants to change the course every 10 seconds instead of running it",
                 "avoid":'"We are done building -- now we run it."',
                 "better":'"You are the chief designer! Run it once, then we can change one thing. Deal?"',
                 "why":"Child-designed obstacle courses engage a uniquely powerful combination: executive planning (designing the sequence), spatial reasoning (mapping the course), and motor execution (running it). Children who build before they use show deeper learning than those who only use pre-built structures, because design requires understanding the relationship between structure and movement -- an early engineering cognition.",
                 "tool":"Builder and Runner",
                 "phrases":['"Your brain built this -- your body will run it."', '"You are the designer and the athlete."'],
                 "skills":"Executive planning, spatial cognition, gross motor."},
            27: {"title":"Dance Party", "emoji":"🕺", "skill":"Expressive Movement", "materials":"Music, coloured lights (optional)",
                 "milestone":"Milestone: Free expressive dancing builds emotional expression, body confidence, and creative movement vocabulary. Children who feel free to move expressively show stronger emotional literacy.",
                 "setup":["Put on favourite music","Make the room feel special -- dim lights, coloured lamp"],
                 "play":["Just dance -- no rules, no right moves","Mirror each other spontaneously","Try moving only arms, then only feet","Slow dance for one song"],
                 "say":['"This is YOUR dance -- there is no wrong way."','"I am copying your move -- look!"','"How does this song make your body feel?"'],
                 "if_happens":"Child wants to sit and watch instead of dance",
                 "avoid":'"Come on -- get up and dance!"',
                 "better":'"I will dance near you -- you can watch. Maybe your fingers will want to join first."',
                 "why":"Free dancing without instruction or correction is one of the few movement activities that activates the default mode network (creativity), the motor cortex (movement), and the limbic system (emotion) simultaneously. This triple activation is uniquely integrating -- children who dance freely develop richer body-emotion connections than those who only perform choreographed movements.",
                 "tool":"Express Through the Body",
                 "phrases":['"Your body told me how you feel."', '"That move looked happy to me."'],
                 "skills":"Expressive movement, body confidence, emotional expression."},
            28: "reflection",
            29: {"title":"Our Movement Journey", "emoji":"📖", "skill":"Reflection + Memory", "materials":"None",
                 "milestone":"Milestone: Reflecting on a month of learning consolidates memory, builds narrative sequencing, and reinforces identity as a capable mover -- a growth mindset foundation.",
                 "setup":["Sit together quietly","No materials needed"],
                 "play":["Ask: which move was your favourite this month?","Act out 3-4 favourite movements together","Take turns naming what was hard and what got easier","Draw or describe your favourite body move"],
                 "say":['"Do you remember the animal walks? Which animal?"','"Show me your strongest move this month."','"You learned so much -- your body can do all of this now."'],
                 "if_happens":"Child cannot remember any activities",
                 "avoid":'"Try to remember -- we did jumping..."',
                 "better":'"Let me start -- I remember the rolling. That was SO dizzy. What do you remember next to that?"',
                 "why":"Prompted reminiscing -- reviewing past experiences together -- strengthens episodic memory consolidation at an age when autobiographical memory is just forming. When parents guide joint memory review in a warm, positive tone, children develop stronger narrative identity and a sense of personal history that contributes to self-confidence and emotional security.",
                 "tool":"Remember Together",
                 "phrases":['"We made memories this month."', '"Your body remembers everything you taught it."'],
                 "skills":"Episodic memory, narrative sequencing, growth mindset."},
            30: "celebration",
        },
        "celebration": {
            "title": "Month 3 Complete: Body Champion!",
            "summary": "This month you explored jumping, balancing, rolling, dancing, and moving together. Your child's body is stronger, more coordinated, and more confident than it was 30 days ago.",
            "skills_built": ["Gross motor confidence", "Balance and coordination", "Vestibular and proprioceptive processing", "Cooperative movement", "Expressive movement"],
            "month4_teaser": "Next month: Feelings and Faces. You will help your child name emotions, read faces, and build the calm-down toolkit that will serve them for life.",
        },
        "reflection_activities": {
            7:  {"activity": "Movement Memory Jar", "desc": "On a piece of paper, draw or scribble your child's favourite move this week. Put it in a jar. At the end of the month you will have 4 memories."},
            14: {"activity": "Balance Challenge", "desc": "How long can your child stand on one foot today versus Day 8? Time it together. Celebrate the growth."},
            21: {"activity": "Slow Motion Star", "desc": "Do the whole routine for getting ready for bed in slow motion together. Brush teeth slowly, put on pyjamas slowly. Giggle and connect."},
            28: {"activity": "Movement Museum", "desc": "Take turns being a statue of your favourite move. The other person guesses what the move is. Then swap."},
        },
    },
}

# ---------------------------------------------------------------------------
# HTML TEMPLATE
# ---------------------------------------------------------------------------

def week_num(day):
    if day <= 7:   return 1
    if day <= 14:  return 2
    if day <= 21:  return 3
    return 4

def make_reflection_html(month_num, day, month_data):
    wk   = week_num(day)
    act  = month_data["reflection_activities"].get(day, {"activity": "Quiet Reflection", "desc": "Sit together and share one favourite moment from the week."})
    mname = month_data["name"]
    wtheme = month_data["weeks"][wk]["title"]
    label  = month_data["toolkit_label"]
    next_day = day + 1
    prev_day = day - 1

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Month {month_num} Day {day} -- TotWise Lab | Week {wk} Reflection</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/member_Day1/member.css">
<script src="/auth/auth.js"></script>
<script src="/reassurance-nudges.js"></script>
<script src="/js/totwise-core.js"></script>
<script src="/soft-day-lock.js"></script>
</head>
<body>
<div class="app-container">
  <header class="app-header">
    <div class="brand">
      <svg class="brand-icon" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#E8B4A0"/>
        <circle cx="11" cy="13" r="2.5" fill="#2D3B3A"/>
        <circle cx="21" cy="13" r="2.5" fill="#2D3B3A"/>
        <path d="M11 21 Q16 26 21 21" stroke="#2D3B3A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
      <div class="brand-text">
        <span class="brand-name">TotWise Lab</span>
        <span class="toolkit-label">{label}</span>
      </div>
    </div>
    <button class="logout-btn">Log out</button>
  </header>
  <main class="content">
    <section class="day-header-card">
      <div class="day-number-badge">Day {day}</div>
      <h1 class="day-title">Week {wk} Reflection &amp; Celebration</h1>
      <p class="day-subtitle">A lighter day to look back, notice growth, and celebrate together.</p>
    </section>

    <div class="week-theme-banner" style="background:#F0F7EF;border-left:4px solid #A8C5A0;padding:1rem 1.25rem;border-radius:12px;margin-bottom:1rem;">
      <span class="week-theme-badge">Week {wk} Complete</span>
      <div class="week-theme-text">
        <span class="week-theme-title">{wtheme} -- Week Done!</span>
        <span class="week-theme-subtitle">You showed up every day this week. That is the whole thing.</span>
      </div>
    </div>

    <section class="activity-card">
      <div class="card-header">
        <span class="card-emoji">&#x1F4AB;</span>
        <h2>Today: {act["activity"]}</h2>
      </div>
      <div class="activity-section">
        <p style="font-size:1rem;line-height:1.7;color:#4A5857;">{act["desc"]}</p>
      </div>
    </section>

    <section class="script-card">
      <div class="card-header small">
        <span class="card-emoji">&#x1F4AC;</span>
        <h3>What to Say Today</h3>
      </div>
      <div class="why-works">
        <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#A8C5A0" opacity="0.2"/><path d="M10 6v5M10 14h.01" stroke="#7BA876" stroke-width="2" stroke-linecap="round"/></svg>
        <p><strong>Reflection days matter:</strong> Pausing to name what was learned helps consolidate memory. When you ask your child "what was your favourite?" you are building narrative memory, vocabulary, and the sense that their experiences have meaning. Even a 2-minute conversation makes the whole week more durable in their developing memory.</p>
      </div>
    </section>

    <section class="emotional-card">
      <div class="card-header small"><span class="card-emoji">&#x1F49B;</span><h3>Parent Note -- Week {wk} of {mname}</h3></div>
      <div class="emotional-content">
        <div class="emotional-text">
          <p>You did Week {wk}. Seven days. That is real consistency, and consistency is everything at this age.</p>
          <p style="margin-top:0.75rem;">Your child does not need perfection from you. They need your presence, your warmth, and your willingness to try. You have given them all three this week.</p>
          <p style="margin-top:0.75rem;">Rest today. Tomorrow, Week {wk+1 if wk < 4 else "5 (the final stretch)"} begins.</p>
        </div>
      </div>
    </section>

    <section class="reassurance-strip">
      <div class="reassurance-icon">
        <svg viewBox="0 0 32 32" fill="none"><path d="M16 4 L18 12 L26 14 L18 16 L16 24 L14 16 L6 14 L14 12 Z" fill="#A8C5A0"/><circle cx="16" cy="14" r="3" fill="white"/></svg>
      </div>
      <div class="reassurance-text">
        <p class="reassurance-title">Week {wk} Skills Built:</p>
        <p class="reassurance-skills">{month_data["weeks"][wk]["title"]} -- 7 days of intentional practice.</p>
        <p class="reassurance-note">Imperfect days count just as much as perfect ones.</p>
      </div>
    </section>

    <section class="completion-section">
      <button class="complete-btn" id="completeBtn">
        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
        <span id="completeBtnText">Mark Today as Complete</span>
      </button>
    </section>
  </main>
  <div class="completion-overlay" id="completionOverlay">
    <div class="completion-modal">
      <div class="completion-celebration">
        <svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" fill="#A8C5A0"/><path d="M30 50l12 12 28-28" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h2>Week {wk} done!</h2>
      <p>Rest today. Week {wk+1 if wk < 4 else "4 -- the final push"} starts tomorrow.</p>
      <button class="modal-close-btn" id="closeModalBtn">Done</button>
    </div>
  </div>
</div>
<script>
(function(){{
  if (typeof TotWiseAuth !== 'undefined') TotWiseAuth.initAuth({{checkURLToken:false,requireAuth:true}});
  else {{ const t = sessionStorage.getItem('loginToken'); if(!t){{ window.location.href='/login/login.html'; return; }} }}
}})();
const currentDay = {day};
(function initDayPage(){{
  TotWiseCore.getProgressState();
  document.querySelector('.logout-btn')?.addEventListener('click', function(){{
    if (typeof TotWiseAuth !== 'undefined') TotWiseAuth.logout();
    else {{ sessionStorage.clear(); window.location.href='/login/login.html'; }}
  }});
  function onCompleteClick(){{
    if (TotWiseCore.isFutureDay(currentDay)){{
      if (typeof TotWiseSoftLock !== 'undefined') TotWiseSoftLock.showCompletionBlockedModal(currentDay);
      return;
    }}
    TotWiseCore.markTodayComplete();
    document.getElementById('completionOverlay').style.display='flex';
    document.getElementById('completeBtnText').textContent='Completed!';
  }}
  document.getElementById('completeBtn')?.addEventListener('click', onCompleteClick);
  document.getElementById('closeModalBtn')?.addEventListener('click', function(){{
    document.getElementById('completionOverlay').style.display='none';
  }});
  const state = TotWiseCore.getProgressState();
  if (state && state.completedDays && state.completedDays.includes(currentDay)){{
    document.getElementById('completeBtnText').textContent='Completed!';
    document.getElementById('completeBtn').classList.add('completed');
  }}
}})();
</script>
</body>
</html>"""


def make_day_html(month_num, day, d, month_data):
    wk     = week_num(day)
    label  = month_data["toolkit_label"]
    mname  = month_data["name"]
    banner = ""
    if day in (1, 8, 15, 22):
        wt = month_data["weeks"][wk]
        banner = f"""<div class="week-theme-banner">
        <span class="week-theme-badge">Week {wk} of 4</span>
        <div class="week-theme-text">
          <span class="week-theme-title">{wt["title"]}</span>
          <span class="week-theme-subtitle">{wt["subtitle"]}</span>
        </div>
      </div>"""

    setup_li  = "".join(f"<li>{s}</li>" for s in d["setup"])
    play_li   = "".join(f"<li>{s}</li>" for s in d["play"])
    bubbles   = "".join(f'<div class="speech-bubble"><span>{s}</span></div>' for s in d["say"])
    phrases   = "".join(f'<span class="phrase">{p}</span>' for p in d["phrases"])
    next_day  = day + 1
    prev_day  = day - 1

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Month {month_num} Day {day} -- TotWise Lab | {d["title"]}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/member_Day1/member.css">
<script src="/auth/auth.js"></script>
<script src="/reassurance-nudges.js"></script>
<script src="/js/totwise-core.js"></script>
<script src="/soft-day-lock.js"></script>
</head>
<body>
<div class="app-container">
  <header class="app-header">
    <div class="brand">
      <svg class="brand-icon" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#E8B4A0"/>
        <circle cx="11" cy="13" r="2.5" fill="#2D3B3A"/>
        <circle cx="21" cy="13" r="2.5" fill="#2D3B3A"/>
        <path d="M11 21 Q16 26 21 21" stroke="#2D3B3A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
      <div class="brand-text">
        <span class="brand-name">TotWise Lab</span>
        <span class="toolkit-label">{label}</span>
      </div>
    </div>
    <button class="logout-btn">Log out</button>
  </header>
  <main class="content">
    <section class="day-header-card">
      <div class="day-info">
        <div class="info-item">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span>10--15 minutes</span>
        </div>
        <div class="info-item">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V11h-4V9.5A4 4 0 0 1 12 2z"/><path d="M8 14h8M9 18h6M10 22h4"/></svg>
          <span>{d["skill"]}</span>
        </div>
        <div class="info-item materials">
          <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          <span>{d["materials"]}</span>
        </div>
      </div>
    </section>

    <div class="milestone-callout">
      <span class="milestone-callout-icon">&#x1F3AF;</span>
      <div class="milestone-callout-content">
        <span class="milestone-callout-label">Age 2--3 {d["milestone"].split(":")[0]}</span>
        <span class="milestone-callout-text">{d["milestone"].split(":",1)[1].strip() if ":" in d["milestone"] else d["milestone"]}</span>
      </div>
    </div>

    {banner}

    <section class="activity-card">
      <div class="card-header">
        <span class="card-emoji">{d["emoji"]}</span>
        <h2>Today's Play: &quot;{d["title"]}&quot;</h2>
      </div>
      <div class="activity-section">
        <h3>
          <svg class="section-icon" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8" fill="#A8C5A0" opacity="0.2"/><path d="M10 6v8M6 10h8" stroke="#A8C5A0" stroke-width="2" stroke-linecap="round"/></svg>
          Setup <span class="time-badge">30 seconds</span>
        </h3>
        <ul class="step-list">{setup_li}</ul>
      </div>
      <div class="activity-section">
        <h3>
          <svg class="section-icon" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8" fill="#E8B4A0" opacity="0.2"/><path d="M7 10l2 2 4-4" stroke="#E8B4A0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          How to Play <span class="time-badge">10--15 minutes</span>
        </h3>
        <ul class="step-list">{play_li}</ul>
      </div>
      <div class="activity-section what-to-say">
        <h3>
          <svg class="section-icon" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8" fill="#F5D5C8" opacity="0.3"/><path d="M7 8h6M7 12h4" stroke="#D9A592" stroke-width="2" stroke-linecap="round"/></svg>
          What You Say
        </h3>
        <div class="speech-bubbles">{bubbles}</div>
      </div>
    </section>

    <section class="worksheet-card">
      <div class="card-header small"><span class="card-emoji">&#x1F5A8;</span><h3>Optional Worksheet</h3></div>
      <p class="worksheet-desc">Draw or scribble whatever you noticed today. No right answer.</p>
      <p class="gentle-note">
        <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#A8C5A0" stroke-width="1.5"/><path d="M10 7v3M10 13h.01" stroke="#A8C5A0" stroke-width="2" stroke-linecap="round"/></svg>
        If your child is not interested today, skip it.
      </p>
      <a href="/member_Month{month_num}_Day{day}/day{day}-worksheet.html" target="_blank" class="worksheet-link">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 16v1a2 2 0 002 2h8a2 2 0 002-2v-1M12 11l-2 2-2-2M10 3v10"/></svg>
        Download Worksheet
      </a>
    </section>

    <section class="script-card">
      <div class="card-header small"><span class="card-emoji">&#x1F4AC;</span><h3>If This Happens...</h3></div>
      <div class="situation"><p class="situation-text">{d["if_happens"]}</p></div>
      <div class="script-comparison">
        <div class="script-avoid">
          <div class="script-label">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#FFE5E5"/><path d="M7 7l6 6M13 7l-6 6" stroke="#D98888" stroke-width="2" stroke-linecap="round"/></svg>
            <span>Avoid saying</span>
          </div>
          <p class="script-text">{d["avoid"]}</p>
        </div>
        <div class="script-better">
          <div class="script-label">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#E8F5E8"/><path d="M7 10l2 2 4-4" stroke="#6AAF6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Say this instead</span>
          </div>
          <p class="script-text">{d["better"]}</p>
        </div>
      </div>
      <div class="why-works">
        <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#A8C5A0" opacity="0.2"/><path d="M10 6v5M10 14h.01" stroke="#7BA876" stroke-width="2" stroke-linecap="round"/></svg>
        <p><strong>Why this works:</strong> {d["why"]}</p>
      </div>
    </section>

    <section class="emotional-card">
      <div class="card-header small"><span class="card-emoji">&#x1F49B;</span><h3>Emotional Tool -- {d["tool"]}</h3></div>
      <div class="emotional-content">
        <div class="emotional-illustration">
          <svg viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="35" fill="#FFF8F5"/>
            <circle cx="40" cy="38" r="22" fill="#FFE5D9"/>
            <circle cx="33" cy="34" r="3" fill="#2D3B3A"/>
            <circle cx="47" cy="34" r="3" fill="#2D3B3A"/>
            <path d="M34 46 Q40 52 46 46" stroke="#2D3B3A" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          </svg>
        </div>
        <div class="emotional-text">
          <p>Today, try saying:</p>
          <div class="emotional-phrases">{phrases}</div>
        </div>
      </div>
    </section>

    <section class="reassurance-strip">
      <div class="reassurance-icon">
        <svg viewBox="0 0 32 32" fill="none"><path d="M16 4 L18 12 L26 14 L18 16 L16 24 L14 16 L6 14 L14 12 Z" fill="#A8C5A0"/><circle cx="16" cy="14" r="3" fill="white"/></svg>
      </div>
      <div class="reassurance-text">
        <p class="reassurance-title">You are building:</p>
        <p class="reassurance-skills">{d["skills"]}</p>
        <p class="reassurance-note">Any engagement counts. Even watching is learning.</p>
      </div>
    </section>

    <section class="completion-section">
      <button class="complete-btn" id="completeBtn">
        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
        <span id="completeBtnText">Mark Today as Complete</span>
      </button>
    </section>
  </main>

  <div class="completion-overlay" id="completionOverlay">
    <div class="completion-modal">
      <div class="completion-celebration">
        <svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" fill="#A8C5A0"/><path d="M30 50l12 12 28-28" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h2>Great job today!</h2>
      <p>You did something wonderful for your child.</p>
      <p class="completion-next">Come back tomorrow for Day {next_day}.</p>
      <button class="modal-close-btn" id="closeModalBtn">Done</button>
    </div>
  </div>
</div>
<script>
(function(){{
  if (typeof TotWiseAuth !== 'undefined') TotWiseAuth.initAuth({{checkURLToken:false,requireAuth:true}});
  else {{ const t = sessionStorage.getItem('loginToken'); if(!t){{ window.location.href='/login/login.html'; return; }} }}
}})();
const currentDay = {day};
(function initDayPage(){{
  TotWiseCore.getProgressState();
  document.querySelector('.logout-btn')?.addEventListener('click', function(){{
    if (typeof TotWiseAuth !== 'undefined') TotWiseAuth.logout();
    else {{ sessionStorage.clear(); window.location.href='/login/login.html'; }}
  }});
  function onCompleteClick(){{
    if (TotWiseCore.isFutureDay(currentDay)){{
      if (typeof TotWiseSoftLock !== 'undefined') TotWiseSoftLock.showCompletionBlockedModal(currentDay);
      return;
    }}
    TotWiseCore.markTodayComplete();
    document.getElementById('completionOverlay').style.display='flex';
    document.getElementById('completeBtnText').textContent='Completed!';
  }}
  document.getElementById('completeBtn')?.addEventListener('click', onCompleteClick);
  document.getElementById('closeModalBtn')?.addEventListener('click', function(){{
    document.getElementById('completionOverlay').style.display='none';
  }});
  const state = TotWiseCore.getProgressState();
  if (state && state.completedDays && state.completedDays.includes(currentDay)){{
    document.getElementById('completeBtnText').textContent='Completed!';
    document.getElementById('completeBtn').classList.add('completed');
  }}
}})();
</script>
</body>
</html>"""


def make_celebration_html(month_num, month_data):
    cel   = month_data["celebration"]
    label = month_data["toolkit_label"]
    mname = month_data["name"]
    skills_li = "".join(f"<li>{s}</li>" for s in cel["skills_built"])

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Month {month_num} Day 30 -- TotWise Lab | Month Complete!</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/member_Day1/member.css">
<script src="/auth/auth.js"></script>
<script src="/reassurance-nudges.js"></script>
<script src="/js/totwise-core.js"></script>
<script src="/soft-day-lock.js"></script>
</head>
<body>
<div class="app-container">
  <header class="app-header">
    <div class="brand">
      <svg class="brand-icon" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#E8B4A0"/>
        <circle cx="11" cy="13" r="2.5" fill="#2D3B3A"/>
        <circle cx="21" cy="13" r="2.5" fill="#2D3B3A"/>
        <path d="M11 21 Q16 26 21 21" stroke="#2D3B3A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
      <div class="brand-text">
        <span class="brand-name">TotWise Lab</span>
        <span class="toolkit-label">{label}</span>
      </div>
    </div>
    <button class="logout-btn">Log out</button>
  </header>
  <main class="content">
    <section class="day-header-card" style="text-align:center;padding:2rem;">
      <div style="font-size:3rem;margin-bottom:0.75rem;">&#x1F3C5;</div>
      <h1 style="font-family:'Nunito',sans-serif;font-size:1.75rem;color:#2D3B3A;">{cel["title"]}</h1>
      <p style="color:#6B7A79;margin-top:0.5rem;">{cel["summary"]}</p>
    </section>

    <section class="activity-card">
      <div class="card-header"><span class="card-emoji">&#x2B50;</span><h2>Month {month_num} Skills Built</h2></div>
      <ul class="step-list" style="margin-top:1rem;">{skills_li}</ul>
    </section>

    <section class="script-card">
      <div class="card-header small"><span class="card-emoji">&#x1F4AC;</span><h3>What Month {month_num + 1} Holds</h3></div>
      <div class="why-works">
        <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#A8C5A0" opacity="0.2"/><path d="M10 6v5M10 14h.01" stroke="#7BA876" stroke-width="2" stroke-linecap="round"/></svg>
        <p>{cel["month4_teaser"] if "month4_teaser" in cel else cel.get("month_next_teaser", "The next month is ready and waiting.")}</p>
      </div>
    </section>

    <section class="reassurance-strip">
      <div class="reassurance-icon">
        <svg viewBox="0 0 32 32" fill="none"><path d="M16 4 L18 12 L26 14 L18 16 L16 24 L14 16 L6 14 L14 12 Z" fill="#A8C5A0"/><circle cx="16" cy="14" r="3" fill="white"/></svg>
      </div>
      <div class="reassurance-text">
        <p class="reassurance-title">You completed Month {month_num}: {mname}.</p>
        <p class="reassurance-skills">30 days. You showed up. That is everything.</p>
        <p class="reassurance-note">When you are ready, Month {month_num + 1} is unlocked in your dashboard.</p>
      </div>
    </section>

    <section class="completion-section">
      <button class="complete-btn" id="completeBtn">
        <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
        <span id="completeBtnText">Complete Month {month_num}</span>
      </button>
    </section>
  </main>

  <div class="completion-overlay" id="completionOverlay">
    <div class="completion-modal">
      <div class="completion-celebration">
        <svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" fill="#E8B4A0"/><path d="M30 50l12 12 28-28" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h2>Month {month_num} Complete!</h2>
      <p>{cel["summary"][:80]}...</p>
      <p class="completion-next">Month {month_num + 1} is waiting in your dashboard.</p>
      <button class="modal-close-btn" id="closeModalBtn">Go to Dashboard</button>
    </div>
  </div>
</div>
<script>
(function(){{
  if (typeof TotWiseAuth !== 'undefined') TotWiseAuth.initAuth({{checkURLToken:false,requireAuth:true}});
  else {{ const t = sessionStorage.getItem('loginToken'); if(!t){{ window.location.href='/login/login.html'; return; }} }}
}})();
const currentDay = 30;
(function initDayPage(){{
  TotWiseCore.getProgressState();
  document.querySelector('.logout-btn')?.addEventListener('click', function(){{
    if (typeof TotWiseAuth !== 'undefined') TotWiseAuth.logout();
    else {{ sessionStorage.clear(); window.location.href='/login/login.html'; }}
  }});
  document.getElementById('completeBtn')?.addEventListener('click', function(){{
    TotWiseCore.markTodayComplete();
    document.getElementById('completionOverlay').style.display='flex';
    document.getElementById('completeBtnText').textContent='Month {month_num} Complete!';
  }});
  document.getElementById('closeModalBtn')?.addEventListener('click', function(){{
    const base = window.location.pathname.split('/member_Month')[0];
    window.location.href = base + '/Dashboard/dashboard.html';
  }});
  const state = TotWiseCore.getProgressState();
  if (state && state.completedDays && state.completedDays.includes(30)){{
    document.getElementById('completeBtnText').textContent='Month {month_num} Complete!';
    document.getElementById('completeBtn').classList.add('completed');
  }}
}})();
</script>
</body>
</html>"""


def make_worksheet(month_num, day, d):
    title = d["title"] if isinstance(d, dict) else f"Day {day}"
    skill = d["skill"] if isinstance(d, dict) else "Reflection"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Month {month_num} Day {day} Worksheet -- TotWise Lab</title>
<style>
  body {{ font-family:'DM Sans',sans-serif; padding:2rem; max-width:600px; margin:0 auto; color:#2D3B3A; }}
  h1 {{ font-family:'Nunito',sans-serif; font-size:1.4rem; color:#2D3B3A; margin-bottom:0.25rem; }}
  .skill {{ font-size:0.85rem; color:#7BA876; font-weight:600; margin-bottom:1.5rem; }}
  .draw-box {{ border:2px dashed #A8C5A0; border-radius:12px; height:220px; margin:1rem 0; display:flex; align-items:center; justify-content:center; color:#A8C5A0; font-size:0.9rem; }}
  .prompt {{ background:#FFF8F5; border-left:4px solid #E8B4A0; border-radius:8px; padding:1rem; margin-bottom:1rem; font-size:0.95rem; line-height:1.6; }}
  .note {{ font-size:0.8rem; color:#9B8B85; margin-top:1rem; }}
  @media print {{ body {{ padding:1rem; }} }}
</style>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
<p style="font-size:0.8rem;color:#A8C5A0;margin-bottom:0.25rem;">TotWise Lab -- Month {month_num} / Day {day}</p>
<h1>{title}</h1>
<p class="skill">Skill focus: {skill}</p>
<div class="prompt">What did you do together today? Draw it, scribble it, or just put a mark. Any mark is perfect.</div>
<div class="draw-box">Draw here &#x270F;</div>
<div class="prompt">One thing you noticed about your child today:<br><br>________________________________________________________________________________</div>
<div class="prompt">One thing you felt during this activity:<br><br>________________________________________________________________________________</div>
<p class="note">Tip: You do not need to keep this worksheet. The value is in the moment, not the paper. But if you save it, it will be a beautiful memory.</p>
</body>
</html>"""


# ---------------------------------------------------------------------------
# GENERATE
# ---------------------------------------------------------------------------

generated = 0
for month_num, month_data in MONTHS.items():
    for day in range(1, 31):
        folder = os.path.join(BASE, f"member_Month{month_num}_Day{day}")
        os.makedirs(folder, exist_ok=True)

        d = month_data["days"][day]

        if d == "reflection":
            html = make_reflection_html(month_num, day, month_data)
        elif d == "celebration":
            html = make_celebration_html(month_num, month_data)
        else:
            html = make_day_html(month_num, day, d, month_data)

        with open(os.path.join(folder, f"member-day{day}.html"), "w", encoding="utf-8") as f:
            f.write(html)

        ws = make_worksheet(month_num, day, d)
        with open(os.path.join(folder, f"day{day}-worksheet.html"), "w", encoding="utf-8") as f:
            f.write(ws)

        generated += 2

print(f"Done. Generated {generated} files for months: {list(MONTHS.keys())}")
