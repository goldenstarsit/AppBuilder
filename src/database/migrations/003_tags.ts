import type { DatabaseAdapter } from "../databaseAdapter";

export const tagsMigration = {
  version: 3,
  name: "tags",
  up(db: DatabaseAdapter): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT,
        UNIQUE (category_id, name)
      );

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'a', 'Defines a hyperlink to another page, resource, or location.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'abbr', 'Defines an abbreviation or acronym.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'address', 'Defines contact information for a person or organization.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'area', 'Defines a clickable area inside an image map.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'article', 'Defines a self-contained piece of content.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'aside', 'Defines content related to the surrounding content.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'audio', 'Embeds audio content.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'b', 'Defines stylistically offset text without added importance.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'base', 'Specifies the base URL and default target for relative URLs.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'bdi', 'Isolates a span of text for bidirectional text handling.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'bdo', 'Overrides the current text direction.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'blockquote', 'Defines an extended quotation from another source.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'body', 'Contains the document body and its visible content.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'br', 'Inserts a line break.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'button', 'Defines a clickable button.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'canvas', 'Provides a drawable graphics surface.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'caption', 'Defines a caption for a table.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'cite', 'Identifies the title of a cited creative work.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'code', 'Represents a fragment of computer code.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'col', 'Defines a column within a table column group.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'colgroup', 'Groups columns in a table for shared properties.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'data', 'Associates content with a machine-readable value.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'datalist', 'Provides predefined options for form controls.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'dd', 'Defines the description or value in a description list.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'del', 'Represents deleted text.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'details', 'Creates a disclosure widget for additional information.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'dfn', 'Marks the defining instance of a term.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'dialog', 'Defines a dialog or interactive modal component.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'div', 'Defines a generic block-level container.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'dl', 'Defines a description list.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'dt', 'Defines a term or name in a description list.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'em', 'Marks text with semantic emphasis.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'embed', 'Embeds external content into the document.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'fieldset', 'Groups related form controls and labels.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'figcaption', 'Defines a caption for a figure.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'figure', 'Groups self-contained media or content with an optional caption.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'footer', 'Defines footer content for a page or section.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'form', 'Defines a form for collecting user input.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'h1', 'Defines the highest-level heading.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'h2', 'Defines a second-level heading.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'h3', 'Defines a third-level heading.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'h4', 'Defines a fourth-level heading.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'h5', 'Defines a fifth-level heading.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'h6', 'Defines a sixth-level heading.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'head', 'Contains document metadata and resource references.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'header', 'Defines introductory content for a page or section.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'hgroup', 'Groups a heading and related introductory content.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'hr', 'Represents a thematic break between sections of content.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'html', 'Defines the root element of an HTML document.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'i', 'Represents text in an alternate voice or mood.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'iframe', 'Embeds another HTML document.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'img', 'Embeds an image.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'input', 'Defines an interactive form input control.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'ins', 'Represents inserted text.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'kbd', 'Represents user input from a keyboard or similar device.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'label', 'Defines a caption for a form control.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'legend', 'Defines a caption for a fieldset.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'li', 'Defines an item in a list.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'link', 'Defines a relationship between the document and an external resource.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'main', 'Defines the main content of a document.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'map', 'Defines an image map containing clickable areas.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'mark', 'Highlights text for reference or relevance.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'menu', 'Defines a menu of commands or controls.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'meta', 'Defines metadata about the HTML document.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'meter', 'Displays a scalar measurement within a known range.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'nav', 'Defines a section containing navigation links.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'noscript', 'Provides alternate content when scripting is unavailable.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'object', 'Embeds an external resource or object.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'ol', 'Defines an ordered list.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'optgroup', 'Groups related options within a select control.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'option', 'Defines an option within a select or datalist.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'output', 'Represents the result of a calculation or user action.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'p', 'Defines a paragraph.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'picture', 'Provides multiple image sources for responsive images.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'pre', 'Defines preformatted text.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'progress', 'Displays progress toward completion of a task.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'q', 'Defines a short inline quotation.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'rp', 'Provides fallback parentheses for ruby annotations.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'rt', 'Defines the ruby annotation text.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'ruby', 'Defines ruby annotation markup.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 's', 'Represents text that is no longer accurate or relevant.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'samp', 'Represents sample output from a computer program.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'script', 'Embeds or references executable code.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'search', 'Defines a search-related section or control group.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'section', 'Defines a generic standalone section of content.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'select', 'Defines a control for selecting an option from a list.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'slot', 'Defines a placeholder for content in a web component.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'small', 'Represents side comments or small print.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'source', 'Defines a media or image resource source.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'span', 'Defines a generic inline container.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'strong', 'Indicates strong importance.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'style', 'Contains CSS style rules for the document.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'sub', 'Defines subscript text.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'summary', 'Defines a visible heading for a details disclosure widget.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'sup', 'Defines superscript text.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'table', 'Defines a table of data.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'tbody', 'Groups the body rows of a table.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'td', 'Defines a data cell in a table.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'template', 'Defines reusable HTML content that is not rendered immediately.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'textarea', 'Defines a multiline text input control.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'tfoot', 'Groups the footer rows of a table.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'th', 'Defines a header cell in a table.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'thead', 'Groups the header rows of a table.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'time', 'Represents a specific period or date/time.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'title', 'Defines the document title.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'tr', 'Defines a row in a table.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'track', 'Defines timed text tracks for media.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'u', 'Represents text with an unarticulated annotation.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'ul', 'Defines an unordered list.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'var', 'Represents a variable in mathematical or programming notation.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'video', 'Embeds video content.'
      FROM category WHERE name = 'tags';

      INSERT OR IGNORE INTO tags (category_id, name, description)
      SELECT id, 'wbr', 'Defines a possible line-break opportunity.'
      FROM category WHERE name = 'tags';
    `);
  },
};
