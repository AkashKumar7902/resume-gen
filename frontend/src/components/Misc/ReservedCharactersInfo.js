import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ReservedCharactersInfo = () => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="reserved-characters-content"
        id="reserved-characters-header"
      >
        <Typography variant="h6">Reserved Characters in LaTeX</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" paragraph>
          In LaTeX, certain characters are reserved for specific functionalities, and they need to be escaped if you
          want to use them as plain text.
        </Typography>
        <Box component="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Character</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Purpose</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>How to Escape/Use Literally</th>
            </tr>
          </thead>
          <tbody>
            {[
              { char: '#', purpose: 'Parameter in macros', escape: '\\#' },
              { char: '$', purpose: 'Math mode delimiter', escape: '\\$' },
              { char: '%', purpose: 'Comment indicator', escape: '\\%' },
              { char: '&', purpose: 'Alignment/tabular column separator', escape: '\\&' },
              { char: '_', purpose: 'Subscript in math mode', escape: '\\_' },
              { char: '{', purpose: 'Start of a group', escape: '\\{' },
              { char: '}', purpose: 'End of a group', escape: '\\}' },
              { char: '~', purpose: 'Non-breaking space', escape: '\\textasciitilde or \\~{}' },
              { char: '^', purpose: 'Superscript in math mode', escape: '\\^{} or \\textasciicircum' },
              { char: '\\', purpose: 'Escape character itself', escape: '\\textbackslash' },
            ].map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.char}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.purpose}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.escape}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ReservedCharactersInfo;
