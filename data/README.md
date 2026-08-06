# UK Universities Dataset

`uk-universities.json` stores the searchable institution list used by the ISoc registration form.

To add or rename an institution, edit the single JSON object for that university and keep the main university entries alphabetically sorted by `name`. `aliases` are search-only terms such as common abbreviations; they do not appear as separate selectable entries.

Last verified: 2026-08-01.

Sources used for verification:

- GOV.UK guidance on checking recognised degree-awarding bodies: https://www.gov.uk/check-university-award-degree/overview
- Office for Students Register guidance and recognised bodies context: https://www.officeforstudents.org.uk/for-providers/registering-with-the-ofs/guide-to-the-ofs-register/
- HESA current provider metadata and downloadable current provider files: https://www.hesa.ac.uk/support/providers/all-hesa-providers

The two final options are not university records:

- `I am not currently affiliated with a university`
- `Other institution not listed`
