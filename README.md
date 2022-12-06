# CAPP30239_FA22

<h1>Final Project: Covid-19 Impact on Renewable Electricity</h1> 
<h3>Why this topic</h3>
We all are witnesses to how many changes Covid-19 brings to our life. The outbreak of Covid-19 leaves many cities in a state of isolation in 2020. The lockdown policy further aggravated the situation. Strict restriction of having outdoor activities limits the energy demand. Considering that, we have reason to believe that world consumption of energy dropped during Covid-19 compared with preceding years. If so, which type of energy did we generate or consume less? To put it more specifically, how’s the performance of clean energy? Did the pandemic impact the growth of renewable energy? With that question, I conducted this data visualization project. To narrow down the discussion, I choose electricity as the focus in the detailed data inspection.


<h3> Data Processing </h3>
<h4> Data preparation</h4>

<p>I hope to find a dataset containing comprehensive information on both supply and demand side of electricity. </p>
<p>
Among the institutions providing data from both sides around the world, International Energy Agency (IEA) has all-inclusive measures of renewable energy <a href="https://www.iea.org/data-and-statistics/data-sets/?filter=renewables">(Renewable Information)</a> but charges a huge fee that students cannot afford. </p>
<p>Hence, my final choice is U.S. Energy Information Administration (EIA). Although EIA does not have a specified amount of renewable electricity consumption, total electricity consumption data for each country is available on the website.
</p>

<h4>Data cleaning</h4> 

The data wrangling was processed on Jupiter notebook in python language. The original dataset downloaded from EIA is dirty. The data table looks just like it shows on the website: all the variables except the year share the same column. It does not distinguish each country and corresponding measures of electricity. In consequence, the datatype is an “object” for all the variables, some even containing special string characters. Besides, a messy trouble is that around 20 countries in the dataset have multiple observations complicating each other. 

To tidy the data, I first filter out the country name as an independent column and then strip out all the special characters occurring in the data frame. For conflicting observations, I sort out a table to check the data and finally decided to save only the first one if multiple records exist.
I also add the iso3 code using the package of pycountries for the convenience of projecting choropleth in JavaScript. 

<h4>Data visualization</h4> 

The types of three charts chosen are the stack area plot, the group line plot as well as the choropleth world map. The area chart is the first one. In case some of the audience might not know well about the field of clean energy, the area plot gives them a basic knowledge of what is going on in the decades. They could check the explicit number of electricity generation for each year with a tooltip.

The second chart, the group line chart gives the audience a detailed look at certain countries. To make the sample more representative, I pick 9 different countries with diverse geographic locations and economic backgrounds. Then I arranged these charts in a 3 by 3 grid for better visualization.

In the end, the choropleth map visualizes the ratio of total electricity consumption over a renewable generation in 2021. A tooltip is also added for the audience to scan the data of the previous year for each country. Not all countries have 2021 data available now, leading to large grey area showing “undefined data” on the map, which might be a shortfall for data visualization. 

The biggest hurdle for me is to set the tooltip in the stack area plot. It is the part of appending the line scrolling with the mouse that I found challenging. The solution refers to Mike Bostock. Another obstacle I came up against is adding a dropdown of year options in HTML and synchronously changing the variable projected for the choropleth. I would like the audience to walk through the changes in the ratio by choosing freely from years. However, I kept having problems with “promise uncaught” when trying to load the data directly. The failure to promise made it impossible to change the variable into the selected option. Therefore, I choose to show the data of previous years in text in the tooltip.
