# Realtime transcription

Realtime transcription turns speech from a microphone into live subtitles. You can show subtitles on the presenter screen, on attendees' devices, or on both. Claper also saves transcript segments for review and CSV export after the event.

Transcription uses Mistral's Voxtral realtime service. Audio travels from the browser running the event manager through your Claper server to Mistral, including on self-hosted instances.

## Enable transcription on your instance

An administrator must first enable the feature in **Administration → Settings → Transcription Settings**, enter a **Mistral API Key**, and click **Save settings**. Transcription is disabled by default.

For self-hosted instances, see the [transcription configuration](/self-hosting/configuration.md#realtime-transcription) for API key storage and network requirements.

## Add transcription to an event

1. Open the [event manager](/usage/manager.md) on the computer connected to the microphone you want to use.
2. Click **Add interaction** and choose **Transcription**.
3. Review the **Language** selection. **Auto-detect** is available; see [Language selection](#language-selection) below for how the current realtime integration uses this setting.
4. Choose where subtitles should appear under **Show subtitles on**:
   - **Presenter and attendee**: show subtitles on both views. This is the default.
   - **Presenter only**: show subtitles on the projected or shared presentation.
   - **Attendee only**: show subtitles on attendees' devices.
5. Allow microphone access when your browser asks, then select a **Microphone**.
6. Click **Add transcription**.

Each event has one transcription configuration. You can edit it from its card in the event manager. The microphone selection is saved locally in that browser for that event, so select it again if you change browsers or computers.

## Start and stop subtitles

New transcription configurations start disabled. Use the toggle on the **Transcription** card to enable it and begin capturing audio. Turn the toggle off to stop capture and the transcription session.

Keep the event manager open on the computer capturing the microphone. The presenter window and attendee devices display subtitles; they do not supply the audio. Closing the event manager stops that browser's microphone capture. If transcription is still enabled when you reopen the event manager, capture starts again.

Transcription runs alongside polls, quizzes, and other interactions, so you can keep subtitles enabled while changing the active interaction.

For microphone capture, use HTTPS (or localhost during development) in a browser supporting microphone access and AudioWorklet. If you change microphones during an event, switch transcription off, select and save the new microphone, then switch transcription back on.

## How it works

1. **Capture:** The event manager captures the selected microphone and converts the audio into 16 kHz, 16-bit PCM chunks, sent approximately every 100 ms.
2. **Stream:** The browser sends those chunks over an authenticated, event-specific WebSocket connection to Claper. The server forwards them to Mistral's realtime transcription API using the configured API key. The API key stays on the server.
3. **Display:** As Mistral returns text, Claper broadcasts updates to connected presenter and attendee views. Live updates show the most recent two sentences and clear after a short pause, keeping subtitles readable while speech continues.
4. **Save:** Claper stores transcript text segments, timestamps, and language metadata in the database, associated with the event's presentation. This capture flow streams audio to Mistral and does not save an audio recording in Claper.

Subtitles arrive progressively, with a delay that depends on the network and transcription service. They are speech-to-text output, not a translation of the presentation.

### Language selection

The administration panel offers a default language, and each event can save its own language selection. Claper uses the event's value, or the instance default when no event language is set, as initial transcript language metadata. Language detected by Mistral replaces that metadata when reported.

In the current realtime implementation, the selected language is not sent to Mistral's WebSocket session. Recognition therefore relies on the service's automatic language detection; selecting a language does not force recognition into that language.

## Review and export transcripts

After terminating the event, open its [report](/usage/reports.md). If transcript segments were saved, the report includes a **Transcriptions** tab where you can read the timestamped text and load more segments.

Use **Export (CSV)** in that tab to download all saved segments. The CSV contains each segment's timestamp, language, and text.

## Troubleshooting

- **Transcription is missing from Add interaction:** Ask an administrator to enable the feature globally and save the settings.
- **No microphones appear or capture does not start:** Check that you are using HTTPS or localhost, allow microphone access in the browser, and verify the selected device is connected.
- **Transcription is enabled but no text appears:** Keep the capturing event manager open, check the microphone input and subtitle visibility setting, and verify that the Mistral API key is configured. On self-hosted instances, check WebSocket connectivity and server logs for Mistral connection or API errors.
- **The API key appears unconfigured after a deployment:** Check whether `SECRET_KEY_BASE` changed. Follow the [secret key recovery guidance](/self-hosting/configuration.md#keep-secret-key-base-stable).
