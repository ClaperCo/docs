# LTI integration (Beta)

You can integrate Claper with other tools LMS using LTI. Currently, only **Moodle** has been tested and we recommand you to use it.

Claper uses LTI 1.3 to connect with your LMS and allow your students to join events directly from your it.

:::info Only on self-hosted version
This feature is available on the self-hosted version of Claper and is not yet available on the Cloud version.
:::

## Moodle

To register Claper as an LTI tool in Moodle:

1. Go to _Site administration > External tool > Manage tools_
2. Enter this address to add the tool: `https://<your-claper-instance>/lti/register`
3. Click on **Add LTI Advantage**
4. Activate Claper
5. Change settings (if not already done):

   - **Tool settings > Default launch container:** New window
   - **Tool settings >Tool configuration usage:** Show in activity chooser and as a preconfigured tool
   - **Services > IMS LTI Assignment and Grade Services:** Use this service for grade sync and column management (for quizzes)

6. Choose Claper in the activity chooser.
7. Set activity name, this will be the name of the created event.
8. Once your activity is created, click on the Claper link to create the event (you need to be an instructor or admin).
9. Every other instructor who click on the link will be added as a facilitator to manage the event.
10. Students are redirected to the event view (if created) to start interacting.

:::info HTTPS requirements for quizzes

To use LTI with Assignment and Grade Services (AGS), you need an HTTPS endpoint for your LMS and for Claper.
:::

## Canvas, Blackboard...

These steps should be similar to the Moodle one, but if you have any trouble or want to contribute to the documentation for these LMS, please let us know.
