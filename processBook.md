# Process Book

Link to initial proposal: https://docs.google.com/document/d/1ox2JzEldCwTgkCKxna-jLT34oJwoHd9bM_2vRIvY-AY/edit?usp=sharing

Github repo: https://github.com/ekavtaradze/final/tree/main
Working datasets:
https://aerospace.csis.org/data/international-astronaut-database/
https://www.kaggle.com/agirlcoding/all-space-missions-from-1957

https://www.kaggle.com/nasa/astronaut-yearbook


Meeting 1
Discussing possible Ideas and looking for interesting data
Came up with 3 different ideas (below)
IDEA 1
How high can movies jump    
This project would very much be for entertainment value. A few areas to explore would be to see the average jump scare over time, or movie rating and number of jump scares. We can also look at the type of scare (minor, major) and compare that with the time between scares.    "https://wheresthejump.com/full-movie-list/
Unfortunately, there will be quite a bit of data processing in the sense of collecting data from the website. There is a lot of information, but we might need to build a web scraper to collet all the .srt files in order to extract all the information we need. Might also want to look into more datasets to find movie sales and cost that could also be factored in."    Some timeline view would best suit the movies over the years, and it may be interesting to select individual movies and compare their timeline scales with others. Could also compare movies by budget and use of jump scares and rating.    The biggest challenge would be some form of web scraper to collect the necessary data to pull something like this off.    
Prof Review:  No need to go all out on the scraper. Maybe collect a smaller but interesting set to explore the idea? Look up "video visulaization" in Google Scholar if you'd like some inspiration from the visualiztion community. The applications will be different, but just looking at the paper figures might lead to some insights. Overall cool and fun idea.

IDEA 2
The Usage of Social Media Across Different Age Groups    
If we are not spending time on hw or with friends college students are likley on social media. Our group thought it may be interesting to track how much time each different age group spends on the different type of social media, and a specific respective service (snapchat, reddit, twitter....) This information could be used to help understand which type of social media has the most usage in terms of people and time spent surfing.     "Currently we would need to do some form of data mining as there is not one large dataset that contains a lot of information that we would helpful to our mission.
But https://github.com/awesomedata/awesome-public-datasets#id92 has some interesting data that may be useful. "    Bubble charts, bar charts, scatterplot graphs, and maybe network trees.     Obviously this project will be difficult if there is not any consistent data that can be used for creating the graph. Additionally, our group believes that some of the information that we would need to complete this project may not be something that is easily accessible to the public.     
Prof Review: Very cool idea. Check out "personal visualization" on Google Scholar-- maybe something will come up, as some folks have studied the idea of visualization for personal reflection. One idea: you could potentially get data from peoples' phones, like Apple, and improve the data visualization at a single person level.

IDEA 3
Working Title: Timeline of Astronauts in Space
Motivation and Objectives *
This idea was inspired by the website https://www.howmanypeopleareinspacerightnow.com/
With this visualization, we would create a timeline to see how many people were in space on a certain date. We are hoping to be able to add specific information about each astronaut.
Example: choose a date, such as Jan 1, 2017, and our visualization should be able to show you how many people were in space at that time, and information about those astronauts.

Data / Data Processing *

Astronaut Specific Info: https://www.kaggle.com/nasa/astronaut-yearbook?select=astronauts.csv
Space Timeline:
https://www.kaggle.com/agirlcoding/all-space-missions-from-1957
https://www.worldspaceflight.com/timeline.php

Astronaut Specific information is available as CSV and will need virtually no transformation.
For the space timeline, CSV includes information about every flight from 1957 - launch time, etc. By joining these two datasets on mission names (missions flown by astronauts), we will get the needed information about who was in space at what times.

Visualization Design *
The starter page shows how many people are in the space on the current date, with their names listed at the bottom of the page. Hovering over the names will bring out more information about them.
At the top of the page, there is an option to change the date. Changing the date will show the corresponding number of people in space and their information.

Anticipated Challenges + Anything Else *

Joining the two datasets and creating a timeline might be a little tricky. - I have looked at the datasets and have a general idea of how they can be crossed. Importing already clean and polished dataset(instead of manipulating it with our code) is probably going to be easier.
Getting nice graphics and interactivity from the visualization is another challenge.

Prof Review:  Cool idea. I definitely recommend pursuing the data join if you go this route, as this often leads to unique insights. Another thought that comes to mind is the XKCD Lord of the Rings timeline visualization. Could be useless, but could be a useful way to show if the same astronauts go to space over time

https://xkcd.com/657/


Meeting 2

Discussing which idea we want to implement - decided on Astronauts Idea
Going over the suggestions made by the professor
Discussing the limitations of our data
Joining the two datasets is hard because the mission names do not match up
Trying to come up with possible visualization for the data that we do have

Tasks for the next meeting on Thursday - 10.03.2021 - Trying to come up with possible visualization for the data that we do have + sketches

Meeting 3

Reviewed each others sketches of the ideas

Decided on:
  - Inspired by the prof suggestion of XKCD LOTR diagram https://xkcd.com/657/
  - Sankey Diagram utilizing NASA astronauts data to map their "path" in life
  - Accompanying map of the world(2d) indicating their birthplace
  - Hovering over the birthplace would highlight the "path" of that astronaut on the Sankey Diagram
  - Data Used: https://www.kaggle.com/nasa/astronaut-yearbook
  Sketches:
   Insert Nick Globe Image
  ![Sankey](/brainStormIdeas/IMG_0043.PNG)


