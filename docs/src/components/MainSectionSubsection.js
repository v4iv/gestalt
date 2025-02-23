// @flow strict
import React, { type Node } from 'react';
import { Box, Flex, Heading, IconButton, Tooltip } from 'gestalt';
import slugify from 'slugify';
import Markdown from './Markdown.js';
import { copyToClipboard } from './Card.js';
import { convertToSentenceCase } from './utils.js';

type Props = {|
  children?: Node,
  description?: string,
  title?: string,
|};

const MainSectionSubsection = ({ children, description, title }: Props): Node => {
  const slugifiedId = slugify(title || '');
  return (
    <Box marginTop={4}>
      <Box marginBottom={title || description ? 8 : 0}>
        {title && (
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                scrollMarginTop: 60,
              },
            }}
            id={slugifiedId}
            data-anchor
          >
            <Flex alignItems="center" gap={2}>
              <Heading size="sm">{convertToSentenceCase(title)}</Heading>
              <Tooltip inline text="Copy link">
                <IconButton
                  accessibilityLabel={`Copy link to ${title}`}
                  icon="link"
                  size="xs"
                  onClick={() => {
                    copyToClipboard(slugifiedId);
                  }}
                  iconColor="darkGray"
                />
              </Tooltip>
            </Flex>
          </Box>
        )}
        {description && (
          <Box maxWidth={572} marginTop={title ? 2 : 0} color="white">
            <Markdown text={description} />
          </Box>
        )}
      </Box>
      {children && (
        <Flex wrap gap={4}>
          {children}
        </Flex>
      )}
    </Box>
  );
};

export default MainSectionSubsection;
