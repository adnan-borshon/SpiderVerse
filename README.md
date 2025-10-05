# SpiderSense

**Project Overview:**
SpiderSense is a **web-based farming simulation game** designed to help farmers in Bangladesh make informed decisions under climate uncertainty. The game focuses on wheat cultivation and simulates three critical stages: sowing, flowering under heat stress, and harvesting under flood risk.

**How It Works:**
- Integrates **NASA satellite data**: soil moisture (SMAP), land surface temperature (MODIS), and flood forecasts (Flood Data Pathfinder).
- Players make decisions on **sowing, irrigation, and harvesting**, with outcomes affecting yield, profit, water efficiency, and crop resilience.
- Real-time data visualization allows users to understand climate risks and resource management.

**Technical Details:**
- **Frontend:** React with TypeScript, styled using Tailwind CSS.
- **Backend:** Express.js.
- **Data Processing:** Python notebook (`data_read_from_datasets`) reads and preprocesses satellite datasets.


**Start the Game:**
- Use **Node.js version 20 or lower**
- Open terminal
- Run `npm run dev`
- Access the game at **localhost:5000**

**Creativity & Impact:**
- Simplifies complex satellite data into an **engaging, interactive game**.
- Helps farmers understand and respond to climate variability.
- Promotes sustainable agriculture, risk management, and resource efficiency.


**Intended Impact:**
SpiderSense empowers farmers to make **data-driven decisions**, improving crop outcomes, conserving water, and increasing resilience against climate threats.
