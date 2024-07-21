INSERT INTO activity_category (activity_category_id, name) VALUES (1, 'Relaxation');
INSERT INTO activity_category (activity_category_id, name) VALUES (2, 'Self-Esteem');
INSERT INTO activity_category (activity_category_id, name) VALUES (3, 'Productivity');
INSERT INTO activity_category (activity_category_id, name) VALUES (4, 'Physical Health');
INSERT INTO activity_category (activity_category_id, name) VALUES (5, 'Social Connection');

INSERT INTO activity_difficulty (activity_difficulty_id, name) VALUES (1, 'EASY');
INSERT INTO activity_difficulty (activity_difficulty_id, name) VALUES (2, 'MEDIUM');
INSERT INTO activity_difficulty (activity_difficulty_id, name) VALUES (3, 'DIFFICULT');

-- Activities

-- Relaxation
INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content) 
VALUES ('4-7-8 breathing', 1, 5, 1, 'Breathe in for 4 seconds, hold for 7 seconds, breathe out for 8 seconds. Repeat.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content) 
VALUES ('Walk outside', 1, 15, 1, 'Walk outside for 15 minutes.  Look at the sky, trees, and listen to the sounds around you.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content) 
VALUES ('Meditation', 1, 15, 1, 'Spend a few minutes meditating to clear your mind.');

-- Self-Esteem
INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Write down something you are grateful for today', 2, 10, 1, 'Write down something you are grateful for today.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Write down something that you did well today', 2, 10, 1, 'Write down something that you did well today.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Atomic goal: Envision yourself in a better place tomorrow', 2, 10, 1, 'Write down what you would like to do tomorrow to start to improve your life.');

-- Productivity
INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Create a To-Do List', 3, 15, 2, 'Write down a list of TODOs for this week.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Declutter Your Workspace', 3, 15, 2, 'Spend 10-15 minutes each day organizing and tidying your workspace to create a more conducive environment for productivity.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Limit Social Media', 3, 60, 2, 'Set a specific hour during the day to avoid all social media to stop distractions.');

-- Physical Health
INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Drink a glass of water', 4, 1, 1, 'Remember that you need multiple glasses of water a day to stay hydrated.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Do 10 pushups', 4, 5, 2, 'Do 10 pushups.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Do 20 situps', 4, 10, 2, 'Do 20 situps.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Do 35 squats', 4, 10, 3, 'Do 35 squats.');

-- Social Connection
INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Call a friend', 5, 10, 1, 'Call a friend to catch up.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Practice gratitude', 5, 10, 1, 'Express appreciation and gratitude to those around you. A simple thank you or a compliment can strengthen relationships.');

INSERT INTO activity (title, activity_category_id, duration_minutes, activity_difficulty_id, content)
VALUES ('Random Acts of Kindness', 5, 10, 2, 'Perform small acts of kindness, such as helping a neighbor, sending a thoughtful note, or giving a compliment. These gestures can brighten someone''s day and build a sense of connection.');