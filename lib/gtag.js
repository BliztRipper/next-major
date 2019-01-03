export const GA_TRACKING_ID = 'UA-41231050-22'
export const GTAG_TRACKING_ID = 'GTM-PXGHH3H'
export const MIXPANEL_TRACKING_ID = 'd553d453bcee39a0d7b421e0aa6a6b62'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => {
  window.gtag('config', GA_TRACKING_ID, GTAG_TRACKING_ID, {
    page_location: url
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  })
}