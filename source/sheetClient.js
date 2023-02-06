import { google } from 'googleapis';

import key from '../secrets.json' assert { type: 'json' };

export const SHEET_ID = '1WHe_WPphvd7MxXf_hBAkcRPRliY2JI9khTfZLw8FB20';

const client = new google.auth.JWT(key.client_email, null, key.private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

const sheets = google.sheets({ version: 'v4', auth: client });

export default sheets;
