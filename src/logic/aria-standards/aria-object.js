// work in progress
// added fix property to some objects
// my thinking is that we can feed this to AI to generate a fix for the user


const ariaObject = {

  areaAltText: {
      link: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H24.html',
      desc: 'Each clickable <area> within an image map has an alt, aria-label or aria-labelledby attribute value that describes the purpose of the link',
      additionalLinks: ['https://dequeuniversity.com/rules/axe/4.2/area-alt']
  },

  elementRole: {
      link: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles',
      desc: 'Element role must support ARIA attributes' 
  },

  ariaHidden: {
      link: 'https://www.w3.org/TR/wai-aria-1.1/#aria-hidden',
      desc: '```aria-hidden=”true”``` should not be present on the document body',
      additionalLinks: ['https://dequeuniversity.com/rules/axe/4.1/aria-hidden-body']
  },

  requiredAttributes: {
      link: 'https://www.w3.org/TR/wai-aria/#introroles',
      desc: 'Elements with ARIA roles are required to have all required ARIA attributes',
      additionalLinks: ['https://www.w3.org/TR/wai-aria-1.1/#state_prop_taxonomy']
  },

  childRoles: {
      link: 'https://www.w3.org/TR/wai-aria-1.1/#roles',
      desc: 'Elements with ARIA role that require child roles contain them'
  },

  requiredParent: {
      link: 'https://www.w3.org/TR/wai-aria-1.1/#roles',
      desc: 'Elements with an ARIA role that require parent roles are contained by them'
  },

  validValueForRole: {
      link: 'https://www.w3.org/TR/wai-aria-1.1/#roles',
      desc: 'All elements with a role attribute use a valid value',
      additionalLinks: ['https://a11ysupport.io/tests/tech__html__role-attribute']
  },
   
  allAriasAreValid: {
      link: 'https://www.w3.org/TR/wai-aria-1.1/#states_and_properties',
      desc: 'All ARIA attributes must be valid attributes'
  },

  discernibleButtonText: {
      link: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role',
      desc: 'Buttons must have discernible text',
      additionalLinks: ['https://dequeuniversity.com/rules/axe/4.1/button-name']
  },

  uniqueIDs: {
      link: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F77.html',
      desc: 'IDs must be unique',
      additionalLinks: ['https://www.w3.org/WAI/WCAG21/Techniques/html/H93.html',
        'https://dequeuniversity.com/rules/axe/4.7/duplicate-id-aria'],
      fix: 'To fix the problem, change an ID value if it is used more than once to be sure each is unique. Unique IDs differentiate each element from another and prevent invalid markup, wherein only the first instance gets acted upon by client-side scripting, or where assistive technologies typically only reference the first one accurately.'
  },

  imageAlts: {
      link: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F65.html',
      desc: 'Informative <img> elements must have a have short, descriptive alternate text and all decorative <img> elements must have empty alt attributes (e.g. alt="")',
      additionalLinks: ['https://www.w3.org/WAI/WCAG21/Techniques/html/H37.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/html/H67.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA10.html',
          'https://dequeuniversity.com/rules/axe/4.4/image-alt']
  },

  inputButton: {
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types',
      desc: 'Inputs require discernible text values',
      additionalLinks: ['https://dequeuniversity.com/rules/axe/4.2/input-button-name'],
      fix: 'To fix the problem, add a value attribute to the input element. The value attribute provides a visible label for the input element. This label is read by screen readers and other assistive technologies to inform users of the purpose of the input element. Alteratively, you can use the title, aria-label, or aria-labelledby attribute to provide a label for the input element.'
  }, 

  inputImageAltText: {
      link: 'https://www.w3.org/WAI/WCAG21/Techniques/failures/F65.html',
      desc: '```<input type=”image”>``` elements require alternative text',
      additionalLinks: ['https://www.w3.org/WAI/WCAG21/Techniques/html/H36.html']
  },

  formsHaveLabels: {
      link: 'https://www.w3.org/WAI/tutorials/forms/labels/',
      desc: 'All forms must have appropriate labels',
      additionalLinks: ['https://www.w3.org/WAI/WCAG21/Techniques/failures/F68.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/html/H44.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA16.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA14.html',
          'https://www.w3.org/WAI/WCAG21/Techniques/html/H65.html',
          'https://dequeuniversity.com/rules/axe/4.8/label-title-only'],
      fix: 'Provide every form control a label using aria-label, aria-labelledby, implicit <label> or explicit <label>'
  },

  metaEquivRefresh: {
      link: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H76.html',
      desc: '```<meta http-equiv=”refresh”>``` should not be used for delayed refresh',
      additionalLinks: ['https://www.w3.org/WAI/WCAG21/Techniques/failures/F41.html',
        'https://dequeuniversity.com/rules/axe/4.8/meta-refresh'],
      fix: 'Remove the http-equiv="refresh" attribute from each meta element in which it is present or increase the refresh time to be greater than 20 hours'
  },

  metaViewport: {
      link: 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html',
      desc: '```<meta name=”viewport”>``` should not disable text scaling and zooming',
      additionalLinks: ['https://dequeuniversity.com/rules/axe/4.1/meta-viewport'],
      fix: 'Remove the user-scalable="no" parameter from the content attribute of the <meta name="viewport"> element in order to allow zooming'
  },

  selectHasAccessName: {
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select',
      desc: 'Select elements should have accessible name',
      additionalLinks: ['https://dequeuniversity.com/rules/axe/4.7/select-name'],
      fix: 'Programmatically associate labels with select elements. The recommended method for most circumstances is to use the label element and an explicit association using the for and id attributes.'
  },

  videoCaptions: {
      link: 'https://www.w3.org/WAI/WCAG21/Techniques/general/G87.html',
      desc: '```<video>``` elements must have captions',
      additionalLinks: ['https://www.w3.org/WAI/WCAG21/Techniques/general/G93.html',
        'https://dequeuniversity.com/rules/axe/4.9/video-caption'],
      fix: 'Ensure all video elements have a caption using the track element with kind attribute set to "captions" or "subtitles"'
  },

  anchorLabel: {
    link: 'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA8.html',
    desc: 'Provide an aria-label attribute with a descriptive text label on a link'
  },

};


module.exports = {
    ariaObject
};