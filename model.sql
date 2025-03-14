-- Delete tables first to avoid foreign key conflicts
DROP TABLE IF EXISTS Song;
DROP TABLE IF EXISTS Album;
DROP TABLE IF EXISTS Artist;

-- Create Artist table with JSON fields for AlbumLists and SongLists
CREATE TABLE Artist (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    artist_name VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    albumlists JSON DEFAULT NULL,
    songlists JSON DEFAULT NULL,
    monthly_listeners INT DEFAULT 0
);

-- Create Album table with JSON list for SongLists
CREATE TABLE Album (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    album_name VARCHAR(255) NOT NULL,
    release_year INT NOT NULL,
    num_listens INT DEFAULT 0,
    songlists JSON DEFAULT NULL,
    artist_id INT NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES Artist(artist_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Song table
CREATE TABLE Song (
    song_id INT AUTO_INCREMENT PRIMARY KEY,
    song_name VARCHAR(255) NOT NULL,
    release_year INT NOT NULL,
    album_id INT NOT NULL,
    FOREIGN KEY (album_id) REFERENCES Album(album_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Trigger after inserting a new album to update artist's albumlists
DELIMITER $$
CREATE TRIGGER after_album_insert
AFTER INSERT ON Album
FOR EACH ROW
BEGIN
    -- If artist's albumlists is NULL, initialize a new JSON array
    IF (SELECT albumlists FROM Artist WHERE artist_id = NEW.artist_id) IS NULL THEN
        UPDATE Artist SET albumlists = JSON_ARRAY(
            JSON_OBJECT(
                'album_id', NEW.album_id,
                'album_name', NEW.album_name,
                'release_year', NEW.release_year,
                'num_listens',NEW.num_listens
            )
        )
        WHERE artist_id = NEW.artist_id;
    ELSE
        -- Append new album information to existing array
        UPDATE Artist SET albumlists = JSON_ARRAY_APPEND(albumlists, '$', JSON_OBJECT(
            'album_id', NEW.album_id,
            'album_name', NEW.album_name,
            'release_year', NEW.release_year,
            'num_listens',NEW.num_listens
        ))
        WHERE artist_id = NEW.artist_id;
    END IF;
END;
$$
DELIMITER ;

-- Trigger to update Artist's albumlists after updating an Album
DELIMITER $$
CREATE TRIGGER after_album_update
AFTER UPDATE ON Album
FOR EACH ROW
BEGIN
    DECLARE album_index VARCHAR(50);

    -- Get the index of the album to update within artist's albumlists
    SET album_index = (
        SELECT JSON_UNQUOTE(JSON_SEARCH(albumlists, 'one', NEW.album_id, NULL, '$[*].album_id'))
        FROM Artist
        WHERE artist_id = NEW.artist_id
    );

    IF album_index IS NOT NULL THEN
        -- Update the existing album information
        UPDATE Artist SET albumlists = JSON_SET(albumlists, 
            REPLACE(album_index, '.album_id', ''), JSON_OBJECT(
                'album_id', NEW.album_id,
                'album_name', NEW.album_name,
                'release_year', NEW.release_year,
                'num_listens',NEW.num_listens
            ))
        WHERE artist_id = NEW.artist_id;
    END IF;
END;
$$
DELIMITER ;

-- Trigger after inserting a Song to update songlists in Album and Artist
DELIMITER $$
CREATE TRIGGER after_song_insert
AFTER INSERT ON Song
FOR EACH ROW
BEGIN
    DECLARE v_artist_id INT;

    -- Retrieve artist_id from Album
    SELECT artist_id INTO v_artist_id FROM Album WHERE album_id = NEW.album_id;

    -- Update Album songlists
    IF (SELECT songlists FROM Album WHERE album_id = NEW.album_id) IS NULL THEN
        UPDATE Album SET songlists = JSON_ARRAY(
            JSON_OBJECT(
                'song_id', NEW.song_id,
                'song_name', NEW.song_name,
                'release_year', NEW.release_year
            ))
        WHERE album_id = NEW.album_id;
    ELSE
        UPDATE Album SET songlists = JSON_ARRAY_APPEND(songlists, '$', JSON_OBJECT(
            'song_id', NEW.song_id,
            'song_name', NEW.song_name,
            'release_year', NEW.release_year
        ))
        WHERE album_id = NEW.album_id;
    END IF;

    -- Update Artist's songlists
    IF (SELECT songlists FROM Artist WHERE artist_id = v_artist_id) IS NULL THEN
        UPDATE Artist SET songlists = JSON_ARRAY(
            JSON_OBJECT(
                'song_id', NEW.song_id,
                'song_name', NEW.song_name,
                'release_year', NEW.release_year
            ))
        WHERE artist_id = v_artist_id;
    ELSE
        UPDATE Artist SET songlists = JSON_ARRAY_APPEND(songlists, '$', JSON_OBJECT(
            'song_id', NEW.song_id,
            'song_name', NEW.song_name,
            'release_year', NEW.release_year
        ))
        WHERE artist_id = v_artist_id;
    END IF;
END;
$$
DELIMITER ;

-- Trigger after updating a Song to update songlists in Album and Artist
DELIMITER $$
CREATE TRIGGER after_song_update
AFTER UPDATE ON Song
FOR EACH ROW
BEGIN
    DECLARE v_artist_id INT;
    DECLARE album_song_index VARCHAR(50);
    DECLARE artist_song_index VARCHAR(50);

    -- Retrieve artist_id
    SELECT artist_id INTO v_artist_id FROM Album WHERE album_id = NEW.album_id;

    -- Update song info in Album's songlists
    SET album_song_index = (
        SELECT JSON_UNQUOTE(JSON_SEARCH(songlists, 'one', NEW.song_id, NULL, '$[*].song_id'))
        FROM Album
        WHERE album_id = NEW.album_id
    );

    IF album_song_index IS NOT NULL THEN
        UPDATE Album SET songlists = JSON_REPLACE(songlists,
            REPLACE(album_song_index, '.song_id', ''), JSON_OBJECT(
                'song_id', NEW.song_id,
                'song_name', NEW.song_name,
                'release_year', NEW.release_year
            ))
        WHERE album_id = NEW.album_id;
    END IF;

    -- Update song info in Artist's songlists
    SET artist_song_index = (
        SELECT JSON_UNQUOTE(JSON_SEARCH(songlists, 'one', NEW.song_id, NULL, '$[*].song_id'))
        FROM Artist
        WHERE artist_id = v_artist_id
    );

    IF artist_song_index IS NOT NULL THEN
        UPDATE Artist SET songlists = JSON_REPLACE(songlists, 
            REPLACE(artist_song_index, '.song_id', ''), JSON_OBJECT(
                'song_id', NEW.song_id,
                'song_name', NEW.song_name,
                'release_year', NEW.release_year
            ))
        WHERE artist_id = v_artist_id;
    END IF;
END;
$$
DELIMITER ;

-- Insert Artists data
INSERT INTO Artist (artist_name, monthly_listeners, genre) VALUES 
('Taylor Swift', 85000000, 'Pop'),
('Eminem', 55000000, 'Hip-Hop'),
('The Beatles', 62000000, 'Rock'),
('Beyoncé', 47000000, 'R&B'),
('Drake', 65000000, 'Hip-Hop'),
('Ed Sheeran', 70000000, 'Pop'),
('Adele', 50000000, 'Soul'),
('Coldplay', 60000000, 'Alternative Rock'),
('Billie Eilish', 75000000, 'Alternative Pop'),
('Kanye West', 58000000, 'Hip-Hop');

-- Insert Albums data
INSERT INTO Album (album_name, release_year, num_listens, artist_id) VALUES
('1989', 2014, 50000000, 1),
('Reputation', 2017, 45000000, 1),
('Lover', 2019, 40000000, 1),
('The Eminem Show', 2002, 60000000, 2),
('Recovery', 2010, 55000000, 2),
('Kamikaze', 2018, 30000000, 2),
('Abbey Road', 1969, 70000000, 3),
('Let It Be', 1970, 65000000, 3),
('Revolver', 1966, 62000000, 3),
('Lemonade', 2016, 50000000, 4),
('Dangerously In Love', 2003, 48000000, 4),
('Beyoncé', 2013, 47000000, 4),
('Scorpion', 2018, 68000000, 5),
('Take Care', 2011, 72000000, 5),
('Certified Lover Boy', 2021, 61000000, 5),
('Divide', 2017, 65000000, 6),
('Multiply', 2014, 63000000, 6),
('Equals', 2021, 60000000, 6),
('21', 2011, 58000000, 7),
('25', 2015, 59000000, 7),
('30', 2021, 54000000, 7),
('Parachutes', 2000, 62000000, 8),
('A Rush of Blood to the Head', 2002, 64000000, 8),
('Viva La Vida', 2008, 70000000, 8),
('When We All Fall Asleep, Where Do We Go?', 2019, 75000000, 9),
('Happier Than Ever', 2021, 72000000, 9),
('Don t Smile at Me', 2017, 60000000, 9),
('Graduation', 2007, 63000000, 10),
('My Beautiful Dark Twisted Fantasy', 2010, 67000000, 10),
('Donda', 2021, 58000000, 10);

-- Insert Songs data
INSERT INTO Song (song_name, release_year, album_id) VALUES
('Style', 2014, 1),
('Blank Space', 2014, 1),
('I Did Something Bad', 2017, 2),
('Getaway Car', 2017, 2),
('Dress', 2017, 2),
('Call It What You Want', 2017, 2),
('I Forgot That You Existed', 2019, 3),
('The Man', 2019, 3),
('You Need To Calm Down', 2019, 3),
('ME!', 2019, 3),
('Without Me', 2002, 4),
('Sing for the Moment', 2002, 4),
('Superman', 2002, 4),
('Till I Collapse', 2002, 4),
('Business', 2002, 4),
('Love the Way You Lie', 2010, 5),
('Not Afraid', 2010, 5),
('No Love', 2010, 5),
('Space Bound', 2010, 5),
('Going Through Changes', 2010, 5),
('Lucky You', 2018, 6),
('Venom', 2018, 6),
('Normal', 2018, 6),
('Stepping Stone', 2018, 6),
('Abbey Road Medley', 1969, 7),
('Here Comes the Sun', 1969, 7),
('Maxwell’s Silver Hammer', 1969, 7),
('Let It Be', 1970, 8),
('Across the Universe', 1970, 8),
('I Me Mine', 1970, 8),
('Hey Jude', 1968, 9),
('Yesterday', 1965, 9),
('Formation', 2016, 10),
('Hold Up', 2016, 12),
('Drunk in Love', 2013, 12),
('Partition', 2013, 12),
('Mine', 2013, 12),
('Survival', 2018, 6),
('Lucky You', 2018, 6),
('Venom', 2018, 6),
('Emotionless', 2018, 13),
('Nonstop', 2018, 13),
('God’s Plan', 2018, 13),
('In My Feelings', 2018, 13),
('Take Care', 2011, 14),
('Marvins Room', 2011, 14),
('Doing It Wrong', 2011, 14),
('Champagne Poetry', 2021, 15),
('Fair Trade', 2021, 15),
('Way 2 Sexy', 2021, 15),
('Rolling in the Deep', 2011, 19),
('Rumour Has It', 2011, 19),
('Turning Tables', 2011, 19),
('Hello', 2015, 20),
('When We Were Young', 2015, 20),
('Send My Love', 2015, 20),
('Easy on Me', 2021, 21),
('Oh My God', 2021, 21),
('Woman Like Me', 2021, 21),
('Shiver', 2000, 22),
('Yellow', 2000, 22),
('Trouble', 2000, 22),
('Clocks', 2002, 23),
('The Scientist', 2002, 23),
('In My Place', 2002, 23),
('Viva la Vida', 2008, 23),
('The Scientist', 2002, 23),
('Paradise', 2008, 24),
('Adventure of a Lifetime', 2015, 23),
('Come Together', 1969, 7),
('Something', 1969, 7),
('Hey Jude', 1968, 9),
('Bad Guy', 2019, 27),
('Lovely', 2017, 27),
('Ocean Eyes', 2017, 27),
('Happier Than Ever', 2021, 26),
('Getting Older', 2021, 26),
('Your Power', 2021, 26),
('Everything I Wanted', 2017, 27),
('Stronger', 2007, 28),
('Can’t Tell Me Nothing', 2007, 28),
('Power', 2010, 29),
('Runaway', 2010, 29),
('All of the Lights', 2010, 29),
('Hurricane', 2021, 30),
('Jail', 2021, 30),
('Off the Grid', 2021, 30),
('Believe Me', 2021, 15),
('Wants and Needs', 2021, 15),
('Laugh Now Cry Later', 2021, 15),
('Someone Like You', 2011, 19),
('Skyfall', 2012, 19),
('Hello', 2015, 20),
('Send My Love', 2015, 20),
('Deja Vu', 2021, 15),
('God’s Plan', 2018, 13),
('In My Feelings', 2018, 13),
('Forever', 2018, 13),
('Started from the Bottom', 2013, 14),
('Take Care', 2011, 14),
('Fix You', 2008, 23),
('Lost!', 2008, 23),
('Stronger', 2007, 28),
('Off the Grid', 2021, 30);
