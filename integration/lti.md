# LTI integration (Beta)

You can integrate Claper with other tools using LTI: Moodle, Canvas...

Claper uses LTI 1.3 to connect with your LMS and allow your students to join events directly from your LMS.

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

   - **Default launch container:** New window
   - **Tool configuration usage:** Show in activity chooser and as a preconfigured tool

6. Choose Claper in the activity chooser.
7. Set activity name, this will be the name of the created event.
8. Once your activity is created, click on the Claper link to create the event (you need to be an instructor or admin).
9. Every other instructor who click on the link will be added as a facilitator to manage the event.
10. Students are redirected to the event view (if created) to start interacting.

## Canvas, Blackboard...

These steps should be similar to the Moodle one, but if you have any trouble or want to contribute to the documentation for these LMS, please let us know.
