import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { BoxBase, DetailsTable, H3, Text, TinyBadge } from "@licenserocks/kit";

import { Cover } from "./cover";

const StyledMarketPlaceItem = styled(BoxBase)`
  border-radius: 8px;
  overflow: hidden;
  min-height: 112px;
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: all 200ms ease-in-out;

  ${({ hoverEffect }) =>
    hoverEffect &&
    css`
      &:hover {
        transform: scale(1.03);
      }
    `}
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(4)};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1;
`;

const Badges = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

const Highlight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  z-index: 1;
`;

export const NftItem = ({
  badges,
  coverSrc,
  details,
  highlight,
  megaTitle,
  subTitle,
  title,
  Wrapper,
  ...props
}) => {
  const Item = () => (
    <StyledMarketPlaceItem {...props}>
      {coverSrc && <Cover imgSrc={coverSrc} />}

      {highlight && (
        <Highlight>
          <Text
            colorWhite
            content={highlight}
            fontWeight="bold"
            fontSize="sm"
          />
        </Highlight>
      )}

      <Content>
        <div>
          <H3 content={title} noWrap />

          <Text
            content={megaTitle}
            color="textSecondary"
            fontSize="sm"
            fontStyle="italic"
            noWrap
          />

          <Text
            content={subTitle}
            color="textSecondary"
            fontSize="sm"
            fontStyle="italic"
            noWrap
          />
        </div>

        <Badges>
          {badges.map((badge) => (
            <TinyBadge {...badge} mr={1} mb={1} />
          ))}
        </Badges>

        <DetailsTable
          justifyBetween
          labelFontSize="sm"
          labelWidth={80}
          mt={4}
          size="sm"
          rows={details}
        />
      </Content>
    </StyledMarketPlaceItem>
  );

  return Wrapper ? (
    <Wrapper>
      <Item />
    </Wrapper>
  ) : (
    <Item />
  );
};

NftItem.propTypes = {
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  coverSrc: PropTypes.string,
  details: PropTypes.array,
  megaTitle: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string,
};

NftItem.defaultProps = {
  badges: [],
  details: [],
};
