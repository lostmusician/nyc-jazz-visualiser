import type { ClubProfile } from '../gallery/model';
import { NYC_JAZZ_VENUES } from './venues';

const youtubeSearch = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

export const CLUB_PROFILES: ClubProfile[] = [
  {
    venueId: '0001',
    description: 'A Harlem Art Deco room whose Zebra Room made elegance, intimacy, and late-night improvisation part of the same ritual.',
    image: '/images/venues/0001.jpg',
    imageAlt: 'Exterior neon facade of the historic Lenox Lounge in Harlem.',
    imageCredit: 'Wikimedia Commons / Lenoxlounge.jpg (Public Domain / CC)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Lenoxlounge.jpg',
    tracks: [{ id: 'lenox-holiday', title: 'God Bless the Child', artist: 'Billie Holiday', year: 1941, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Billie Holiday God Bless the Child official audio'), evidenceUrl: 'https://www.cbsnews.com/newyork/news/historic-lenox-lounge-in-harlem-to-close-on-new-years-eve/', note: 'Holiday performed at the Lenox Lounge; this recording evokes the room rather than documenting a specific set.' }],
  },
  {
    venueId: '0002',
    description: 'A Sugar Hill neighborhood room remembered for Monday jam sessions that carried several generations into the early morning.',
    image: '/images/venues/0002.jpg',
    imageAlt: 'Luckey Roberts, Harlem stride pianist and owner of Lucky’s Rendezvous (later St. Nick’s Pub), with Willie "The Lion" Smith in 1958.',
    imageCredit: 'Wikimedia Commons / Historic photograph (1958)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Charles_L._%22Luckey%22_Roberts_standing_with_his_much_taller_pal,_Willie_%22The_Lion%22_Smith,_in_1958.jpg',
    tracks: [{ id: 'stnicks-jam', title: 'After Hours', artist: 'The Three Sounds', year: 1961, relationship: 'representative-of-scene', listenUrl: youtubeSearch('The Three Sounds After Hours'), evidenceUrl: 'https://www.theguardian.com/music/2015/oct/06/new-york-city-jazz-venues-gentrification-indie-clubs', note: 'A representative late-night jam selection; no claim is made that this take was recorded at St. Nick’s.' }],
  },
  {
    venueId: '0003',
    description: 'The musicians’ workshop where Thelonious Monk, Dizzy Gillespie, Charlie Christian, and others tested the language that became bebop.',
    image: '/images/venues/0003.jpg',
    imageAlt: 'Thelonious Monk, Howard McGhee, Roy Eldridge, and Teddy Hill at Minton’s Playhouse in Harlem, photographed by William P. Gottlieb, ca. Sept. 1947.',
    imageCredit: 'William P. Gottlieb / Library of Congress (ca. September 1947)',
    imageSourceUrl: 'https://www.loc.gov/item/gottlieb.06201/',
    tracks: [{ id: 'mintons-epistrophy', title: 'Epistrophy', artist: 'Thelonious Monk', year: 1948, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Thelonious Monk Epistrophy 1948'), evidenceUrl: 'https://www.nps.gov/articles/000/minton-s-playhouse.htm', note: 'Monk was central to Minton’s house band; this studio performance represents music forged in those sessions.' }],
  },
  {
    venueId: '0020',
    description: 'The original “Jazz Corner of the World,” named for Charlie Parker and built around a nightly collision of bebop stars and big-band royalty.',
    image: '/images/venues/0020.jpg',
    imageAlt: 'Entrance of Birdland, the Jazz Corner of the World, Broadway and 52nd Street, ca. 1950.',
    imageCredit: 'Wikimedia Commons / Archival postcard photograph (ca. 1950, Public Domain)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Birdland_club_entrance.jpg',
    tracks: [{ id: 'birdland-lullaby', title: 'Lullaby of Birdland', artist: 'George Shearing', year: 1952, relationship: 'documented-performance', listenUrl: youtubeSearch('George Shearing Lullaby of Birdland 1952'), evidenceUrl: 'https://www.birdlandjazz.com/history', note: 'Written for the club and its radio broadcast; this is the venue’s signature composition.' }],
  },
  {
    venueId: '0021',
    description: 'A musician-backed 52nd Street room whose signed door documented many of the players associated with Swing Street.',
    image: '/images/venues/0021.jpg',
    imageAlt: 'Portrait of Dizzy Gillespie performing at the Famous Door on 52nd Street, photographed by William P. Gottlieb, ca. June 1946.',
    imageCredit: 'William P. Gottlieb / Library of Congress (ca. June 1946)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Portrait_of_Dizzy_Gillespie,_Famous_Door,_New_York,_N.Y.,_ca._June_1946.jpg',
    tracks: [{ id: 'famous-door-basie', title: "One O’Clock Jump", artist: 'Count Basie Orchestra', year: 1937, relationship: 'documented-performance', listenUrl: youtubeSearch('Count Basie One O Clock Jump 1937'), evidenceUrl: 'https://www.jazzwax.com/2014/04/the-famous-door-1935-60.html', note: 'Count Basie’s orchestra held a celebrated Famous Door engagement; this was its theme.' }],
  },
  {
    venueId: '0022',
    description: 'A narrow 52nd Street club where swing gave way to the sharper contours of modern jazz in the mid-1940s.',
    image: '/images/venues/0022.jpg',
    imageAlt: 'West 52nd Street ("Swing Street") showing the Onyx Club, Jimmy Ryan’s, and Three Deuces neon marquees at night, photographed by William P. Gottlieb, 1948.',
    imageCredit: 'William P. Gottlieb / Library of Congress (1948)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:52nd_Street,_New_York,_by_Gottlieb,_1948.jpg',
    tracks: [{ id: 'onyx-tunisia', title: 'A Night in Tunisia', artist: 'Dizzy Gillespie', year: 1946, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Dizzy Gillespie A Night in Tunisia 1946'), evidenceUrl: 'https://www.jazzhistorytree.com/onyx-club/', note: 'Gillespie led a modern-jazz group at the Onyx; this recording represents that emerging vocabulary.' }],
  },
  {
    venueId: '0004',
    description: 'The triangular basement whose close acoustics turned live albums into architecture and made continuity itself part of the club’s legend.',
    image: '/images/venues/0004.jpg',
    imageAlt: 'Exterior street view and red-and-white awning of the historic Village Vanguard at 178 7th Avenue South.',
    imageCredit: 'Wikimedia Commons / Historic photograph (August 2008)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Village_Vanguard,_178_7th_Ave_S,_New_York,_NY_10014,_August_2008.jpg',
    tracks: [{ id: 'vanguard-spiritual', title: 'Spiritual', artist: 'John Coltrane', year: 1961, relationship: 'recorded-at-venue', listenUrl: youtubeSearch('John Coltrane Spiritual Live at the Village Vanguard'), evidenceUrl: 'https://www.johncoltrane.com/music/live-at-the-village-vanguard', note: 'Recorded at the Village Vanguard in November 1961.' }],
  },
  {
    venueId: '0025',
    description: 'A Cooper Square room where Monk’s return, Coltrane’s development, and Ornette Coleman’s arrival made listening feel confrontational and new.',
    image: '/images/venues/0025.jpg',
    imageAlt: 'Cooper Square and the Third Avenue El corridor in the East Village, 1957, home to the Five Spot Café.',
    imageCredit: 'Wikimedia Commons / Historic street photograph (1957)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Cooper_Square_-_NYC_-_1957_crop.jpg',
    tracks: [{ id: 'five-spot-monks-mood', title: "Monk’s Mood", artist: 'Thelonious Monk with John Coltrane', year: 1957, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Thelonious Monk John Coltrane Monks Mood 1957'), evidenceUrl: 'https://www.loc.gov/item/ihas.200182840/', note: 'Monk and Coltrane’s Five Spot residency defined this partnership; the surviving recording was made elsewhere.' }],
  },
  {
    venueId: '0026',
    description: 'An Avenue B proving ground where hard bop, free jazz, writers, and neighborhood life pressed against one another nightly.',
    image: '/images/venues/0026.jpg',
    imageAlt: 'Trumpeter Lee Morgan, regular headliner whose music defined the hard bop sound at Slugs’ Saloon on Avenue B.',
    imageCredit: 'Harry Pot / Anefo / Nationaal Archief / Wikimedia Commons (1959)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Lee_Morgan_(1959).jpg',
    tracks: [{ id: 'slugs-search', title: 'Search for the New Land', artist: 'Lee Morgan', year: 1964, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Lee Morgan Search for the New Land'), evidenceUrl: 'https://www.nytimes.com/2022/03/22/arts/music/lee-morgan-slugs-saloon.html', note: 'Morgan was a regular at Slugs’; this selection represents the searching hard-bop language heard there.' }],
  },
  {
    venueId: '0011', description: 'Sam and Beatrice Rivers’ Bond Street home became a musician-run laboratory and the symbolic center of New York’s loft-jazz network.',
    image: '/images/jazz-club-scenes-1940s-08.jpg', imageAlt: 'Musicians and listeners gathered inside an intimate performance room.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://daily.bandcamp.com/lists/loft-jazz-list',
    tracks: [{ id: 'rivbea-wildflowers', title: 'Hues of Melanin', artist: 'Sam Rivers', year: 1976, relationship: 'recorded-at-venue', listenUrl: youtubeSearch('Sam Rivers Hues of Melanin Wildflowers Loft Jazz'), evidenceUrl: 'https://daily.bandcamp.com/lists/loft-jazz-list', note: 'Recorded during the Wildflowers sessions at Studio Rivbea.' }],
  },
  {
    venueId: '0012', description: 'Rashied Ali’s Greene Street loft joined performance, rehearsal, recording, and community in one artist-controlled room.',
    image: '/archive/greene/rashied-ali-poster.webp', imageAlt: 'A period Rashied Ali performance poster.', imageCredit: 'Thomas Ager archival material', imageSourceUrl: 'https://rashiedali.org/',
    tracks: [{ id: 'alis-alley-duo', title: 'Duo Exchange', artist: 'Rashied Ali & Frank Lowe', year: 1973, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Rashied Ali Frank Lowe Duo Exchange'), evidenceUrl: 'https://rashiedali.org/', note: 'Issued on Ali’s Survival Records and representative of the music surrounding his loft practice.' }],
  },
  {
    venueId: '0006', description: 'A Lower East Side home for experimental music whose final night became a protest against the economics remaking the neighborhood.',
    image: '/images/jazz-club-scenes-1940s-03.jpg', imageAlt: 'An experimental ensemble playing to an attentive club audience.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://en.wikipedia.org/wiki/Tonic_(music_venue)',
    tracks: [{ id: 'tonic-zorn', title: 'Cobra', artist: 'John Zorn', year: 1987, relationship: 'representative-of-scene', listenUrl: youtubeSearch('John Zorn Cobra live'), evidenceUrl: 'https://www.nytimes.com/2007/04/16/arts/music/16toni.html', note: 'Zorn was closely associated with Tonic; this game piece represents the collaborative practice it supported.' }],
  },
  {
    venueId: '0019', description: 'The original Houston Street room put improvisers, composers, noise bands, and downtown experimenters onto the same tiny stage.',
    image: '/images/jazz-club-scenes-1940s-12.jpg', imageAlt: 'A downtown ensemble performing under hard stage light.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://knittingfactory.com/',
    tracks: [{ id: 'knitting-naked-city', title: 'Batman', artist: 'Naked City', year: 1989, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Naked City Batman John Zorn'), evidenceUrl: 'https://www.jazztimes.com/features/profiles/after-hours-new-yorks-jazz-joints-through-the-ages/', note: 'Representative of the genre collisions associated with the original Knitting Factory.' }],
  },
  {
    venueId: '0016', description: 'A Black community space in Bedford-Stuyvesant where music, political education, and neighborhood stewardship remain inseparable.',
    image: '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(23).jpg', imageAlt: 'A jazz vocalist performing with a small ensemble.', imageCredit: 'William P. Gottlieb collection study image', imageSourceUrl: 'https://sistasplace.org/',
    tracks: [{ id: 'sistas-hi-fly', title: 'Hi-Fly', artist: 'Randy Weston', year: 1958, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Randy Weston Hi-Fly'), evidenceUrl: 'https://sistasplace.org/jazz-history-in-bedford-stuyvesant/', note: 'Weston’s Brooklyn-rooted music represents the community lineage sustained by Sistas’ Place.' }],
  },
  {
    venueId: '0017', description: 'A Park Slope back room built for adventurous, border-crossing music, from jazz improvisation to global folk traditions.',
    image: '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(24).jpg', imageAlt: 'Musicians sharing a small stage in a close room.', imageCredit: 'William P. Gottlieb collection study image', imageSourceUrl: 'https://www.barbesbrooklyn.com/about',
    tracks: [{ id: 'barbes-slavic', title: 'Taketron', artist: 'Slavic Soul Party!', year: 2015, relationship: 'documented-performance', listenUrl: youtubeSearch('Slavic Soul Party Taketron'), evidenceUrl: 'https://www.barbesbrooklyn.com/about', note: 'Slavic Soul Party!’s long-running Barbès residency embodies the room’s cross-genre identity.' }],
  },
  {
    venueId: '0027', description: 'A composer-led experimental institution whose move to Brooklyn gave ambitious new music a permanent hall and public archive.',
    image: '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(5).jpg', imageAlt: 'An experimental jazz group performing onstage.', imageCredit: 'William P. Gottlieb collection study image', imageSourceUrl: 'https://roulette.org/',
    tracks: [{ id: 'roulette-braxton', title: 'Composition 23B', artist: 'Anthony Braxton', year: 1974, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Anthony Braxton Composition 23B'), evidenceUrl: 'https://roulette.org/about/', note: 'Braxton is central to the experimental-composer community Roulette has presented; this is a representative work.' }],
  },
];

export const ADDITIONAL_VENUE_PROFILES: ClubProfile[] = [
  {
    venueId: 'early-cotton-club',
    description: 'A nationally broadcast showcase for Duke Ellington and Cab Calloway, performed by Black artists for a segregated white audience.',
    image: '/images/venues/early-cotton-club.jpg',
    imageAlt: 'Exterior marquee and awning of the original Harlem Cotton Club at 142nd Street and Lenox Avenue, 1930.',
    imageCredit: 'Wikimedia Commons / Historic photograph (1930, Public Domain)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Cotton_Club_1930.jpg',
    tracks: [{ id: 'cotton-mood-indigo', title: 'Mood Indigo', artist: 'Duke Ellington', year: 1930, relationship: 'documented-performance', listenUrl: youtubeSearch('Duke Ellington Mood Indigo 1930'), evidenceUrl: 'https://s-media.nyc.gov/agencies/lpc/lp/2671.pdf', note: 'Composed during Ellington’s landmark residency at the Harlem Cotton Club.' }],
  },
  {
    venueId: 'early-connies-inn',
    description: 'A major Prohibition-era Harlem cabaret whose stage featured Fats Waller, Fletcher Henderson, and Louis Armstrong.',
    image: '/images/venues/early-connies-inn.jpg',
    imageAlt: 'Fats Waller at the piano, composer of the Hot Chocolates revue which premiered at Connie’s Inn in 1929.',
    imageCredit: 'Alan Fisher / New York World-Telegram & Sun Collection / Library of Congress',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Fats_Waller_NYWTS.jpg',
    tracks: [{ id: 'connies-aint-misbehavin', title: "Ain't Misbehavin'", artist: 'Louis Armstrong', year: 1929, relationship: 'documented-performance', listenUrl: youtubeSearch('Louis Armstrong Aint Misbehavin 1929'), evidenceUrl: 'https://ufl.pb.unizin.org/cottonclub/chapter/chapter-5-prohibition-is-repealed-and-the-depression-deepens/', note: 'Premiered in Fats Waller’s Hot Chocolates revue at Connie’s Inn before moving to Broadway.' }],
  },
  {
    venueId: 'early-smalls-paradise',
    description: 'A legendary Black-owned Harlem basement ballroom known for singing waiters, acrobatic dancing, and community rent-party solidarity.',
    image: '/images/venues/early-smalls-paradise.jpg',
    imageAlt: 'Performers and musicians on the bandstand at Small’s Paradise in Harlem, circa 1942.',
    imageCredit: 'Wikimedia Commons / Archival photograph (ca. 1942, Public Domain)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Smalls_Paradise_circa_1942.jpg',
    tracks: [{ id: 'smalls-stride', title: 'Carolina Shout', artist: 'James P. Johnson', year: 1921, relationship: 'representative-of-scene', listenUrl: youtubeSearch('James P Johnson Carolina Shout'), evidenceUrl: 'https://s-media.nyc.gov/agencies/lpc/lp/2671.pdf', note: 'Stride piano pioneer James P. Johnson helped define the Harlem sound heard across early venues like Small’s.' }],
  },
  {
    venueId: 'early-savoy-ballroom',
    description: 'The "Home of Happy Feet": Harlem’s integrated ballroom where the Lindy Hop was born and Chick Webb’s orchestra battled all comers.',
    image: '/images/venues/early-savoy-ballroom.jpg',
    imageAlt: 'Couples dancing the Lindy Hop across the vast dance floor of the Savoy Ballroom in Harlem, November 1936.',
    imageCredit: 'Life Magazine / Wikimedia Commons (1936, Public Domain)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Dancing_at_the_Savoy_Ballroom_1936.jpg',
    tracks: [{ id: 'savoy-stomp', title: 'Stompin’ at the Savoy', artist: 'Chick Webb and his Orchestra', year: 1934, relationship: 'documented-performance', listenUrl: youtubeSearch('Chick Webb Stompin at the Savoy 1934'), evidenceUrl: 'https://s-media.nyc.gov/agencies/lpc/lp/2671.pdf', note: 'Chick Webb’s house band anthem commemorating the Savoy Ballroom.' }],
  },
  {
    venueId: 'outer-845-club',
    description: 'A legendary Morrisania ballroom that brought bebop, Afro-Cuban jazz, and community pride to the post-war South Bronx.',
    image: '/images/venues/outer-845-club.jpg',
    imageAlt: 'Portrait of bebop pioneer Dizzy Gillespie in New York, May 1947, photographed by William P. Gottlieb.',
    imageCredit: 'William P. Gottlieb / Library of Congress (May 1947)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Portrait_of_Dizzy_Gillespie,_New_York,_N.Y.,_ca._May_1947.jpg',
    tracks: [{ id: '845-manteca', title: 'Manteca', artist: 'Dizzy Gillespie and His Orchestra', year: 1947, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Dizzy Gillespie Manteca 1947'), evidenceUrl: 'https://bronxmusichall.org/', note: 'Gillespie’s pioneering Afro-Cuban jazz big band sound was a fixture at Club 845 in Morrisania.' }],
  },
  {
    venueId: 'early-hickory-house',
    description: 'A popular Swing Street steakhouse with a circular bar and centered bandstand, home to Joe Marsala and Marian McPartland.',
    image: '/images/venues/early-hickory-house.jpg',
    imageAlt: 'Clarinetist Joe Marsala and harpist Adele Girard performing at Hickory House on 52nd Street, ca. 1947.',
    imageCredit: 'William P. Gottlieb / Library of Congress (ca. 1947)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:(Portrait_of_Joe_Marsala_and_Adele_Girard,_Hickory_House,_New_York,_N.Y.,_between_1946_and_1948)_(LOC)_(5395854288).jpg',
    tracks: [{ id: 'hickory-singin-the-blues', title: 'Singin’ the Blues', artist: 'Marian McPartland Trio', year: 1954, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Marian McPartland Singin the Blues'), evidenceUrl: 'https://www.newyorker.com/magazine/1963/02/23/talent-scout-2', note: 'McPartland maintained a legendary long-term residency at the Hickory House circular bar.' }],
  },
  {
    venueId: 'early-jimmy-ryans',
    description: 'A steadfast 52nd Street sanctuary for traditional New Orleans jazz and Sunday jam sessions led by Sidney Bechet.',
    image: '/images/venues/early-jimmy-ryans.jpg',
    imageAlt: 'Soprano saxophonist Sidney Bechet and clarinetist Bob Wilber jamming at Jimmy Ryan’s on 52nd Street, ca. Jan. 1947.',
    imageCredit: 'William P. Gottlieb / Library of Congress (ca. January 1947)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Bob_Wilber,_Sidney_Bechet_(Gottlieb_09161).jpg',
    tracks: [{ id: 'ryans-blue-horizon', title: 'Blue Horizon', artist: 'Sidney Bechet and His Blue Note Jazz Men', year: 1944, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Sidney Bechet Blue Horizon 1944'), evidenceUrl: 'https://www.loc.gov/item/2023868400/', note: 'Bechet’s expressive soprano blues was a cornerstone of Jimmy Ryan’s traditional sound.' }],
  },
  {
    venueId: 'early-three-deuces',
    description: 'A compact cellar club where Swing Street witnessed the birth of bebop through Charlie Parker and Miles Davis.',
    image: '/images/venues/early-three-deuces.jpg',
    imageAlt: 'Exterior street entrance and awning of Three Deuces at 72 West 52nd Street, ca. July 1948, photographed by William P. Gottlieb.',
    imageCredit: 'William P. Gottlieb / Library of Congress (ca. July 1948)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Three_Deuces,_New_York,_N.Y.,_ca._July_1948_(William_P._Gottlieb_11361).jpg',
    tracks: [{ id: 'three-deuces-ornithology', title: 'Ornithology', artist: 'Charlie Parker Septet', year: 1946, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Charlie Parker Ornithology 1946'), evidenceUrl: 'https://www.loc.gov/item/2023867832/', note: 'Parker and Miles Davis headlined legendary small-combo bebop runs at the Three Deuces.' }],
  },
  {
    venueId: 'early-downbeat-club',
    description: 'A 52nd Street showcase where vocal legends Billie Holiday and Sarah Vaughan shared the bill with emerging bebop masters.',
    image: '/images/venues/early-downbeat-club.jpg',
    imageAlt: 'Billie Holiday performing at the Downbeat Club on 52nd Street, photographed by William P. Gottlieb, ca. Feb. 1947.',
    imageCredit: 'William P. Gottlieb / Library of Congress (ca. February 1947)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Billie_Holiday,_Downbeat,_New_York,_N.Y.,_ca._Feb._1947_(William_P._Gottlieb_04251).jpg',
    tracks: [{ id: 'downbeat-lover-man', title: 'Lover Man (Oh, Where Can You Be?)', artist: 'Billie Holiday', year: 1945, relationship: 'documented-performance', listenUrl: youtubeSearch('Billie Holiday Lover Man 1945'), evidenceUrl: 'https://www.loc.gov/static/collections/gerry-mulligan/articles-and-essays/jeru-in-the-words-of-gerry-mulligan/charlie-parker.html', note: 'Holiday gave celebrated engagements at the Downbeat Club during the mid-1940s.' }],
  },
  {
    venueId: 'early-royal-roost',
    description: 'The "Metropolitan Bopera House": Broadway’s first major home for modern jazz and birthplace of Miles Davis’s Birth of the Cool nonet.',
    image: '/images/venues/early-royal-roost.jpg',
    imageAlt: 'Original concert handbill for Miles Davis and his 9-Piece Band performing at the Royal Roost, September 1948.',
    imageCredit: 'Wikimedia Commons / Archival concert poster (September 1948)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Davis_Miles-RoyalRoost-1948-09-04_18x24_v01-mockupF-1x1_5e8901ec-f257-4c06-9349-3993d4e7239b.jpg',
    tracks: [{ id: 'royal-roost-boplicity', title: 'Boplicity', artist: 'Miles Davis Nonet', year: 1949, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Miles Davis Boplicity'), evidenceUrl: 'https://www.jazztimes.com/features/profiles/after-hours-new-yorks-jazz-joints-through-the-ages/', note: 'The Birth of the Cool arrangements debuted live on Symphony Sid’s Royal Roost radio broadcasts.' }],
  },
  {
    venueId: 'vp-arthurs-tavern',
    description: 'One of New York’s longest continuously running jazz and blues taprooms, located in a 19th-century West Village building on Grove Street.',
    image: '/images/venues/vp-arthurs-tavern.jpg',
    imageAlt: 'Exterior street corner view of Arthur’s Tavern on Grove Street in the West Village.',
    imageCredit: 'Wikimedia Commons / Historic photograph (2000)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Arther%27s_Tavern.JPG',
    tracks: [{ id: 'arthurs-stompers', title: 'Sweet Georgia Brown', artist: 'Grove Street Stompers', year: 1962, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Grove Street Stompers Sweet Georgia Brown'), evidenceUrl: 'https://jazzmap.villagepreservation.org/', note: 'The Grove Street Stompers held a continuous multi-decade Monday night residency at Arthur’s.' }],
  },
  {
    venueId: 'vp-bottom-line',
    description: 'A 400-seat Greenwich Village cabaret showroom on West 4th Street that hosted fusion giants, rock legends, and electric jazz masters.',
    image: '/images/venues/vp-bottom-line.jpg',
    imageAlt: 'Historic masonry building at West 4th and Mercer Street, former home of The Bottom Line cabaret.',
    imageCredit: 'Wikimedia Commons / Street photograph',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:19_West_4th_Street.jpg',
    tracks: [{ id: 'bottom-line-weather', title: 'Birdland', artist: 'Weather Report', year: 1977, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Weather Report Birdland'), evidenceUrl: 'https://www.latimes.com/archives/la-xpm-2003-dec-23-et-duke23-story.html', note: 'Weather Report and modern jazz-fusion innovators packed The Bottom Line during the late 1970s.' }],
  },
  {
    venueId: 'vp-sweet-basil',
    description: 'A wood-paneled Greenwich Village jazz sanctuary on 7th Avenue South renowned for weekend jazz brunches and modern acoustic jazz.',
    image: '/images/venues/vp-sweet-basil.jpg',
    imageAlt: 'Veteran trumpeter Doc Cheatham performing during a Sunday jazz brunch at Sweet Basil in Greenwich Village.',
    imageCredit: 'Wikimedia Commons / Photograph by Doc Cheatham fans / Public Domain',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Doc_Cheatham_2.jpg',
    tracks: [{ id: 'sweet-basil-cheatham', title: 'I’ve Got a Crush on You', artist: 'Doc Cheatham', year: 1982, relationship: 'documented-performance', listenUrl: youtubeSearch('Doc Cheatham Ive Got a Crush on You'), evidenceUrl: 'https://jazzmap.villagepreservation.org/', note: 'Doc Cheatham’s Sunday brunch residency at Sweet Basil became a Village cultural institution.' }],
  },
  {
    venueId: 'vp-cafe-society',
    description: 'America’s first racially integrated nightclub outside Harlem, founded by Barney Josephson in Sheridan Square as a progressive home for music.',
    image: '/images/venues/vp-cafe-society.jpg',
    imageAlt: 'Sarah Vaughan performing at Café Society (Downtown) in Greenwich Village, photographed by William P. Gottlieb, ca. Sept. 1946.',
    imageCredit: 'William P. Gottlieb / Library of Congress (ca. September 1946)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Sarah_Vaughan,_Cafe_Society_1946_(Gottlieb_08831).jpg',
    tracks: [{ id: 'cafe-society-fruit', title: 'Strange Fruit', artist: 'Billie Holiday', year: 1939, relationship: 'documented-performance', listenUrl: youtubeSearch('Billie Holiday Strange Fruit official audio'), evidenceUrl: 'https://www.loc.gov/item/gottlieb.08831/', note: 'Billie Holiday debuted the anti-lynching anthem Strange Fruit on the Café Society stage in 1939.' }],
  },
  {
    venueId: 'vp-cookery',
    description: 'Barney Josephson’s University Place dining room that famously hosted blues and jazz matriarch Alberta Hunter’s historic late-career comeback.',
    image: '/images/venues/vp-cookery.jpg',
    imageAlt: 'Portrait of blues legend Alberta Hunter, who launched her celebrated musical comeback at The Cookery in 1977.',
    imageCredit: 'Lynn Gilbert / Wikimedia Commons (Creative Commons Attribution-Share Alike 4.0)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Alberta_Hunter_%C2%A9Lynn_Gilbert.jpg',
    tracks: [{ id: 'cookery-downhearted', title: 'Downhearted Blues', artist: 'Alberta Hunter', year: 1978, relationship: 'documented-performance', listenUrl: youtubeSearch('Alberta Hunter Downhearted Blues 1978'), evidenceUrl: 'https://jazzmap.villagepreservation.org/', note: 'Hunter electrified capacity crowds at The Cookery with revival recordings of her classic repertoire.' }],
  },
  {
    venueId: 'vp-eddie-condons',
    description: 'Guitarist Eddie Condon’s Greenwich Village stronghold for Chicago and Dixieland swing at 47 West 3rd Street.',
    image: '/images/venues/vp-eddie-condons.jpg',
    imageAlt: 'Guitarist and bandleader Eddie Condon at Eddie Condon’s in Greenwich Village, photographed by William P. Gottlieb, ca. June 1946.',
    imageCredit: 'William P. Gottlieb / Library of Congress (ca. June 1946)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Eddie_Condon,_Eddie_Condon%27s,_New_York,_ca._June_1946_(William_P._Gottlieb_01691).jpg',
    tracks: [{ id: 'condons-jam', title: 'At the Jazz Band Ball', artist: 'Eddie Condon and His Band', year: 1946, relationship: 'documented-performance', listenUrl: youtubeSearch('Eddie Condon At the Jazz Band Ball 1946'), evidenceUrl: 'https://jazzmap.villagepreservation.org/', note: 'Condon’s signature Chicago-style ensemble jam tune performed nightly at his Village club.' }],
  },
  {
    venueId: 'vp-nicks-tavern',
    description: 'Nick Rongetti’s legendary 7th Avenue South tavern, the primary Manhattan anchor for traditional jazz and fiery Dixieland improvisation.',
    image: '/images/venues/vp-nicks-tavern.jpg',
    imageAlt: 'Cornetist Muggsy Spanier performing at Nick’s Tavern in Greenwich Village, photographed by William P. Gottlieb, 1946.',
    imageCredit: 'William P. Gottlieb / Library of Congress (1946)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Muggsy_Spanier_Nick%27s_New_York_1946-.jpg',
    tracks: [{ id: 'nicks-spanier', title: 'Relaxin’ at the Touro', artist: 'Muggsy Spanier and His Ragtime Band', year: 1939, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Muggsy Spanier Relaxin at the Touro'), evidenceUrl: 'https://jazzmap.villagepreservation.org/', note: 'Spanier was a perennial favorite on the bandstand at Nick’s in the Village.' }],
  },
  {
    venueId: 'vp-bradleys',
    description: 'The premier University Place piano bar where the finest pianists in jazz history played intimate duo sets until the early dawn.',
    image: '/images/venues/vp-bradleys.jpg',
    imageAlt: 'Pianist Kenny Barron, one of the defining masters of the late-night piano-and-bass duo format at Bradley’s.',
    imageCredit: 'Wikimedia Commons / Historic photograph (1986)',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Kenny_Barron.jpg',
    tracks: [{ id: 'bradleys-barron', title: 'Voyage', artist: 'Kenny Barron Trio', year: 1986, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Kenny Barron Voyage'), evidenceUrl: 'https://jazzmap.villagepreservation.org/', note: 'Barron was among the regular pianists who shaped the listening reverence at Bradley’s.' }],
  },
];

export const CLUB_PROFILE_BY_ID = new Map(CLUB_PROFILES.map((profile) => [profile.venueId, profile]));
export const FEATURED_VENUE_IDS = new Set(CLUB_PROFILES.map((profile) => profile.venueId));

export const ALL_SOURCED_PROFILES_BY_ID = new Map([
  ...CLUB_PROFILES.map((profile) => [profile.venueId, profile] as const),
  ...ADDITIONAL_VENUE_PROFILES.map((profile) => [profile.venueId, profile] as const),
]);

const STUDY_IMAGES = [
  '/images/jazz-club-scenes-1940s-01.jpg',
  '/images/jazz-club-scenes-1940s-02.jpg',
  '/images/jazz-club-scenes-1940s-03.jpg',
  '/images/jazz-club-scenes-1940s-08.jpg',
  '/images/jazz-club-scenes-1940s-09.jpg',
  '/images/jazz-club-scenes-1940s-12.jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(5).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(8).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(16).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(23).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(24).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(29).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(32).jpg',
] as const;

const imageIndexForVenue = (venueId: string) => {
  let hash = 0;
  for (const character of venueId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash % STUDY_IMAGES.length;
};

const fallbackProfile = (venue: (typeof NYC_JAZZ_VENUES)[number]): ClubProfile => {
  const { properties } = venue;
  const kind = properties.venue_type.replace(/_/g, ' ');
  const years = `${properties.open_year ?? 'an unknown date'} to ${properties.close_year ?? 'the present'}`;
  return {
    venueId: properties.id,
    description: properties.description
      ?? properties.quote
      ?? `${properties.name} was a ${kind} at ${properties.address} in ${properties.neighborhood}, documented as operating from ${years}.`,
    image: STUDY_IMAGES[imageIndexForVenue(properties.id)],
    imageAlt: `Archival jazz performance study image representing the era of ${properties.name}.`,
    imageCredit: 'William P. Gottlieb Collection archival study image; not presented as a photograph of this venue.',
    imageSourceUrl: 'https://www.loc.gov/collections/william-p-gottlieb-jazz-photos/',
    tracks: [],
  };
};

/** All sourced venues receive a card; the 16 records above retain richer research. */
export const GALLERY_PROFILES: ClubProfile[] = NYC_JAZZ_VENUES.map((venue) => {
  const custom = ALL_SOURCED_PROFILES_BY_ID.get(venue.properties.id);
  const fallback = fallbackProfile(venue);
  if (!custom) return fallback;
  return {
    ...custom,
    description: venue.properties.description ?? custom.description,
  };
});
export const GALLERY_PROFILE_BY_ID = new Map(GALLERY_PROFILES.map((profile) => [profile.venueId, profile]));
export const GALLERY_VENUE_IDS = new Set(GALLERY_PROFILES.map((profile) => profile.venueId));
