// custom typefaces
// import "typeface-montserrat"
// import "typeface-merriweather"

import "normalize.css/normalize.css"
import "./src/assets/variables.css"
import "./src/assets/foundation.css"
import "prismjs/themes/prism-tomorrow.css"

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faTwitter,
  faFacebookF,
  faGithubAlt,
} from "@fortawesome/free-brands-svg-icons"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import {
  faLink,
  faTag,
  faMountain,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons"

library.add(
  faTwitter,
  faFacebookF,
  faGithubAlt,
  faClock,
  faLink,
  faTag,
  faMountain,
  faAngleLeft,
  faAngleRight
)
