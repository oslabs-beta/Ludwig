const ariaObject = {

  areaAltText: {
      link: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H24.html',
      desc: '```<area>``` elements of image maps should have alternate text.'
  },

  elementRole: {
      link: ['https://www.w3.org/TR/wai-aria-1.1/#state_prop_taxonomy', 
      'https://www.w3.org/TR/wai-aria-1.1/#roles '
  ],
      desc: 'Element role must support ARIA attributes.'
  },

  ariaHidden: {
      link: 'https://www.w3.org/TR/wai-aria-1.1/#aria-hidden ',
      desc: '```aria-hidden=”true”``` should not be present on the document body.'
  },

  requiredAttributes: {
      link: ['https://www.w3.org/TR/wai-aria/#introroles', 
      'https://www.w3.org/TR/wai-aria-1.1/#state_prop_taxonomy '
  ],
      desc: 'Elements with ARIA roles are required to have all required ARIA attributes.'
  },

  childRoles: {
      link: 'https://www.w3.org/TR/wai-aria-1.1/#roles',
      desc: 'Elements with ARIA role that require child roles contain them.'
  },

  requiredParent: {
      link: 'https://www.w3.org/TR/wai-aria-1.1/#roles',
      desc: 'Elements with an ARIA role that require parent roles are contained by them.'
  },

  validValueForRole: {
      link: ['https://www.w3.org/TR/wai-aria-1.1/#roles', 
      'https://a11ysupport.io/tests/tech__html__role-attribute '
  ],
      desc: 'All elements with a role attribute use a valid value.'
  },
   
  allAriasAreValid: {
      link: 'https://www.w3.org/TR/wai-aria-1.1/#states_and_properties',
      desc: 'All ARIA attributes must be valid attributes.'
  },

  discernibleButtonText: {
      link: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role',
      desc: 'Buttons should have discernible text.'
  },

  uniqueIDs: {
      link: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F77.html',
      desc: 'IDs must be unique.'
  },

  imageAlts: {
      link: [
          'https://www.w3.org/WAI/WCAG21/Techniques/failures/F65.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/html/H37.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/html/H67.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA10.html'
      ],
      desc: '```<img>``` elements require alternate text or a role of none or presentation.'
  },

  inputButton: {
      link: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role',
      desc: 'Input buttons require discernible text.'
  }, 

  inputImageAltText: {
      link: [
          'https://www.w3.org/WAI/WCAG21/Techniques/failures/F65.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/html/H36.html'
      ],
      desc: '```<input type=”image”>``` elements require alternative text.'
  },

  formsHaveLabels: {
      link: [
          'https://www.w3.org/WAI/tutorials/forms/labels/',
          'https://www.w3.org/WAI/WCAG21/Techniques/failures/F68.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/html/H44.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA16.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA14.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/html/H65.html'
      ],
      desc: 'All forms must have appropriate labels.'
  },

  metaEquivRefresh: {
      link: [
          'https://www.w3.org/WAI/WCAG21/Techniques/html/H76.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/failures/F41.html'
      ],
      desc: '```<meta http-equiv=”refresh”>``` should not be used for delayed refresh.'
  },

  metaViewport: {
      link: 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html',
      desc: '```<meta name=”viewport”>``` should not disable text scaling and zooming.'
  },

  selectHasAccessName: {
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select',
      desc: 'Select elements should have accessibile name.'
  },

  videoCaptions: {
      link: [
      'https://www.w3.org/WAI/WCAG21/Techniques/general/G87.html',
      'https://www.w3.org/WAI/WCAG21/Techniques/general/G93.html'
      ],
      desc: '```<video>``` elements must have captions.'
  },

  anchorLabel: {
    link: 'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA8.html',
    desc: 'Provide an aria-label attribute with a descriptive text label on a link.'
  },

};


module.exports = {
    ariaObject
};