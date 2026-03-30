## Zealthy Mini-EMR Project

Following is the developed user flow based on the requirement understandings:
- Patient is required to login
- Patient will see their basic details (Name, and Email)
- In the same login session, they can access admin portal page from navbar button
- They can also end session by loggin out
- On admin page, they can create new user, view patients and modify their appointments, and prescriptions

Pagination has been implemented for handling large data especially for patient lists.

### Tech Stack
I have used `NextJS` in my frontend and `Python` in Backend. Using `PostgreSQL` for database queries.
Reasons:
- Although this is a software that will be targeted to specific user groups (SEO is not the main criteria) but in case there is a requirement where we want to include a landing page or integrate some third-party or on platform service, we can create those APIs without needing to modify our existing backned system
- Selected PostgreSQL database for dealing with table structures as we will have same schema for all patients and it will be robust to query the data when comparing with NoSQL database at large scale.

I have containerized my whole project using docker for easy deployments and creating testing containers if required

I have created a `seed.py` file that will create the initial database enteries. 

`Note`: When trying to login, please refer to this `seed.py` file for accessing the portal.

### Room for improvements
- I tried to take the Zealthy website theme. But I do understand the UI is very basic and can be improved. For instance showing a confirmation modal on delete functionality.

If required please let me know the exact UI/UX requirements for me to deliver the pixel perfect version of the pages. 