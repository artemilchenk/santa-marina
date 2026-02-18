export const dispatchGA4LinkClickEvent = ({ event, position, outbound, name }) => {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: 'ga4Event',
    event_name: 'click',
    click: {
      value: event.target?.innerText || '',
      click_url: window.location.href,
      element_position: position,
      method: `outbound: ${outbound}`,
      content_type: `Button Click, ${name || position}`
    }
  });
};

export const dispatchGA4ShareEvent = (method, contentType, contentName) => {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: 'ga4Event',
    event_name: 'share',
    share: {
      click_url: window.location.href,
      method,
      content_type: contentType,
      content_name: contentName
    }
  });
};

export const dispatchGA4JourneyEvent = (status, contentType) => {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: 'ga4Event',
    event_name: 'journey',
    journey: {
      content_type: contentType,
      status
    }
  });
};
