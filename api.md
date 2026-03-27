# API Mock Endpoints

## /admin/analytics/summary?law_firm_id=...

Returns visits and conversion analytics summary, month over month results, and daily counts for sparklines.
Returns results for a single law firm if law_firm_id provided.

```jsonc
{
  "summary": {
    "visits": 4268,
    "conversions": 426,
    "conversion_rate": 10.5, // conversion percent
  },
  "month_over_month": {
    "previous_period_start": "2026-01-24",
    "previous_period_end": "2026-02-22",
    "current_period_start": "2026-02-23",
    "current_period_end": "2026-03-24",
    "previous_visits": 11,
    "previous_conversions": 5,
    "previous_conversion_rate": 45.45454545454545,
    "current_visits": 2,
    "current_conversions": 2,
    "current_conversion_rate": 100.0, // conversion percent
    "visits_change": -81.81818181818183, // percent change
    "conversions_change": -60.0, // percent change
    "conversion_rate_change": 54.54545454545455, // percent difference in conversion rate
  },
  "series": {
    "visits": [45, 52, 38, 30, 42, 55, 60],
    "conversions": [20, 25, 32, 35, 28, 35, 40],
  },
}
```

## /admin/analytics/chart/leads

Returns the leads chart data for visits and conversions aggregated automatically based on the duration of the period selected.
Returns results for a single law firm if law_firm_id provided.

```json
{
  "totals": {
    "visits": 100,
    "conversions": 100
  },
  "series": {
    "visits": [92, 109, 146],
    "conversions": [92, 109, 146]
  },
  "labels": ["Dec 25", "Jan 26", "Feb 26"]
}
```

## /admin/accounts

Returns the list of law firms.

```jsonc
{
  "data": [
    {
      "name": "Law Firm",
      "website": "www.lawfirm.com",
      "employees": 10, // can be null
      "location": "Los Angeles, CA", // can be null
      "visits": 100,
      "conversions": 10,
      "conversion_rate": 10.0, // conversion percent
      "contract_term": "annual",
      "activation_date": "2024-10-30",
      "next_payment_date": "2026-10-25",
      "status": "active", // inactive otherwise
      "onboarding_health": "good",
      "performance_health": "fair",
      "website_health": "poor",
      "practice_areas": [
        // can be null or empty array
        "Personal Injury",
        "Corporate",
        "Wills and Estates",
      ],
    },
  ],
}
```

## /admin/account?law_firm_id=...

Returns the details for a single law firm, including health metrics.

```jsonc
{
  "name": "Law Firm",
  "username": "lawfirm",
  "website": "www.lawfirm.com",
  "employees": 10,
  "location": "Los Angeles, CA",
  "marketing_agency": "Matador",
  "marketing_spend": 10000, // often null
  "contract_term": "annual",
  "activation_date": "2024-10-30",
  "next_payment_date": "2026-10-25",
  "status": "active",
  "onboarding_health": "good", // good, fair, or poor
  "performance_health": "fair",
  "website_health": "poor",
  "practice_areas": [
    // can be null or empty array
    "Personal Injury",
    "Corporate",
    "Wills and Estates",
  ],
  "integrations": [
    // can be null or empty array
    "ClioGrow",
    "Lawmatics",
    "Zapier",
  ],
  "tech_stack": [
    // can be null or empty array
    "Clio Manage",
    "Clio Grow",
  ],
  "features": [
    // can be null or empty array
    "Clips",
    "Ad Manager",
  ],
}
```

## /admin/account/users?law_firm_id=...

Returns the list of users for a law firm

```json
{
  "data": [
    {
      "name": "Full Name",
      "role": "admin",
      "email": "name@example.com",
      "created_date": "2026-01-13"
    }
  ]
}
```

## /admin/account/performance/chart?law_firm_id=...

Returns the performance chart for the conversion rate comparison.
NOTE: Use the existing /admin/analytics/... endpoints for the cards and visits/conversions charts, just provide the law firm as a param.

```json
{
  "series": {
    "current": [10, 8, 10, 6, 6, 5, 4],
    "previous": [8, 9, 8, 5, 5, 7, 5]
  },
  "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}
```

## /admin/account/performance/funnels?law_firm_id=...

Returns the performance for funnels.

```jsonc
{
  "data": [
    {
      "name": "Personal Injury",
      "visits": 100,
      "conversions": 10,
      "conversion_rate": 10.0, // conversion percent
    },
  ],
}
```

## /admin/account/website?law_firm_id=...

Returns the main website metrics for the law firm.

```jsonc
{
  "status": "live", // down if website down
  "source_attribution": "enabled", // disabled other option
  "link_status": "up", // down if no lawbrokr link on home page
  "ssl_status": "enabled", // disabled if no ssl
  "load_time": 8, // unit is seconds
  "live_links": 39, // number of total live lawbrokr links
  "live_links_prev": 35, // number of live lawbrokr links the previous month
  "live_links_change": -10.5, // percent change in link
  "integrations": [
    // Can be null or empty array
    "Scorpion",
    "Intaker",
  ],
}
```

## /admin/account/website/links?law_firm_id=...

Returns the list of lawbrokr links on the customer website.

```jsonc
{
  "data": [
    {
      "website_url": "www.lawfirm.com",
      "lawbrokr_url": "lawfirm.lawbrokr.com", // may be null for broken or review
      "status": "active", // active, review, or broken
    },
  ],
}
```

## /admin/account/usage?law_firm_id=...

Returns the usage details for the law firm.

```jsonc
{
  "active": true, // false otherwise
  "funnel_live": true,
  "lawbrokr_url_live": true, // lawbrokr url live on website
  "integrations_active": 0, // if > 0 then mark as success
  "users_added": 0, // if > 0 mark as success
  "status": "active", // inactive otherwise
  "contract_term": "annual", // monthly is other option
  "activation_date": "2024-10-30",
  "next_payment_date": "2026-10-25",
  "live_funnels": 12,
  "live_workflows": 29,
}
```

## /admin/account/usage/users?law_firm_id=...

Return the list of users.

```jsonc
{
  "data": [
    {
      "name": "Full Name",
      "role": "admin",
      "email": "name@example.com",
      "phone": "4165007647", // You'll need to apply north american formatting
      "last_visit": 1774383208, // epoch you'll want to show local time in browser
      "latest_interactions": [
        // will be often empty array or null as most users never login
        "Home",
        "Analytics",
        "Responses",
      ],
      "lead_notifications": false,
      "integration_notifications": true,
      "platform_notifications": false,
    },
  ],
}
```

## /admin/account/usage/details?law_firm_id=...

Returns the detailed breakdown of the law firms usage across different segments of the platform (funnels, workflows, clips, etc.). In many cases landing pages, ad campaigns, clips, and automations may all have no results as a smaller percentage of users make use of these features.

```jsonc
{
  "funnels": [
    {
      "name": "Personal Injury",
      "url": "lawfirm.lawbrokr.com/personal-injury",
      "visits": 100,
      "conversions": 10,
      "conversion_rate": 10.0, // conversion percent
      "workflows": 5,
      "created_at": 1774383208, // epoch you'll want to show local time in browser
      "status": "active", // inactive otherwise
    },
  ],
  "workflows": [
    {
      "name": "Auto Accidents",
      "url": "lawfirm.lawbrokr.com/personal-injury/auto-accidents",
      "questions": 6,
      "visits": 100,
      "conversions": 10,
      "conversion_rate": 10.0, // conversion percent
      "completion_time": 330, // seconds you'll want to display as X min Y sec.
      "created_at": 1774383208, // epoch you'll want to show local time in browser
      "status": "active", // inactive otherwise
    },
  ],
  "landing_pages": [
    {
      "name": "Landing Page Accidents",
      "url": "lawfirm.lawbrokr.com/lp/landing-page-accidents",
      "visits": 100,
      "conversions": 10,
      "conversion_rate": 10.0, // conversion percent
      "created_at": 1774383208, // epoch you'll want to show local time in browser
      "status": "active", // inactive otherwise
    },
  ],
  "ad_campaigns": [
    {
      "name": "Google Ad Campaign",
      "url": "www.lawfirm.com", // Most ads direct traffic to their website
      "impressions": 1000,
      "clicks": 100,
      "conversions": 10,
      "click_through_rate": 10.0, // Click through rate (CTR) percent
      "spend": 5000, // amount spent on ads
      "created_at": 1774383208, // epoch you'll want to show local time in browser
      "status": "active", // inactive otherwise
    },
  ],
  "clips": [
    {
      "name": "Clip",
      "clicks": 100,
      "conversions": 10,
      "conversion_rate": 10.0, // conversion percent
      "created_at": 1774383208, // epoch you'll want to show local time in browser
      "status": "active", // inactive otherwise
    },
  ],
  "automations": [
    {
      "name": "Automation Test",
      "type": "Abandon Cart",
      "sent": 100,
      "open_rate": 10.0, // percent open rate
      "created_at": 1774383208, // epoch you'll want to show local time in browser
      "status": "active", // inactive otherwise
    },
  ],
}
```
