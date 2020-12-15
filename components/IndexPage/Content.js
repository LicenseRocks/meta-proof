import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ChipBadge,
  TinyBadge,
  DetailsTable,
  H1,
  H3,
  Text,
  Icon,
  Image,
  Paragraph,
  HistoryTree,
} from "@licenserocks/kit";
import styled from "styled-components";

import { HistoryPicker } from "components/HistoryPicker";
import date from "utils/date";
import { getTransaction } from "utils/ethereum";
import { withTranslation } from "i18n";
import Link from "next/link";
import iconMapper from "./iconMapper";

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  & > h1 {
    margin-right: 8px;
  }
  & > * {
    margin-right: 4px;
  }
`;

const StyledDetailsTable = styled(DetailsTable)``;

const AbstractContentContainer = styled.div`
  display: flex;
  margin-right: 32px;
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary.light};
`;

const StyledImage = styled(Image)`
  max-width: 200px;
  margin-right: 24px;
  box-sizing: border-box;
`;

const MainContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 220px;
  margin-right: 32px;
`;

const HistoryTreeContainer = styled.div`
  margin-top: 40px;
`;

const CryptoIcon = styled(Icon).attrs({
  icon: "file",
  color: "secondary",
  squared: true,
})`
  width: 32px;
  height: 32px;
`;

const CryptoProofContainer = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin-right: 8px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;

  a {
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 10px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-left: 16px;
    text-decoration: none;
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const CryptoProof = ({ value, url }) => {
  return (
    <CryptoProofContainer>
      <CryptoIcon squared />
      <a href={url}>{value}</a>
    </CryptoProofContainer>
  );
};

CryptoProof.propTypes = {
  value: PropTypes.string.isRequired,
  url: PropTypes.string,
};

CryptoProof.defaultProps = {
  url: "#",
};

const renderRest = (rest) => {
  if (typeof rest === "object") {
    const res = Object.keys(rest)
      .map((key) => {
        if (!rest[key]) return false; // null is also an object
        if (typeof rest[key] === "string" && date.isValid(rest[key]))
          return {
            label: key,
            value: date.format(rest[key]),
            icon: iconMapper(key),
          };
        if (typeof rest[key] === "string")
          return { label: key, value: rest[key], icon: iconMapper(key) };
        if (rest[key]?.label)
          return {
            label: rest[key].label,
            value: rest[key].value,
            icon: iconMapper(key),
          };
        if (typeof rest[key] === "object" && typeof rest[key][0] === "string")
          return {
            label: rest[key].label,
            value: rest[key].join(", "),
            icon: iconMapper(key),
          };
        if (
          typeof rest[key] === "object" &&
          typeof rest[key][0]?.label === "string"
        )
          return {
            label: key,
            value: rest[key].map((item) => item.label).join(", "),
            icon: iconMapper(key),
          };
        return false;
      })
      .filter((obj) => obj);
    return res;
  }
  return [];
};

const getChildLink = (childId) => {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set("id", childId);

  return currentUrl.toString();
};

export const IndexContent = withTranslation("index")(
  ({
    amount,
    childId,
    title,
    price,
    unique,
    exclusive,
    network,
    histories,
    coverSrc,
    abstract,
    t,
    fileURI: _fileURI,
    _documents,
    ...rest
  }) => {
    // Order histories by created_at in descending way
    const orderedHistories = histories.sort(
      (first, second) =>
        Date.parse(second.created_at || first.createdAt) -
        Date.parse(first.created_at || first.createdAt)
    );
    const [activeHistory, setActiveHistory] = useState(orderedHistories[0]);
    const [txInfo, setTxInfo] = useState(null);
    const [txLoading, setTxLoading] = useState(false);

    const getTransactionInfo = () => {
      setTxLoading(true);
      setTxInfo(null);
      getTransaction(activeHistory.txHash, network)
        .then((tx) => setTxInfo(tx))
        .finally(() => setTxLoading(false));
    };

    useEffect(() => {
      if (activeHistory.txHash) getTransactionInfo();
    }, []);

    return (
      <>
        <HeaderContainer>
          <H1 content={title} />
          {exclusive && <TinyBadge label={t("exclusive")} color="warning" />}
          {unique && <TinyBadge label={t("unique")} color="success" />}
        </HeaderContainer>
        <Text color="textSecondary" mb={2}>
          {t("network")}:
          <Text
            color="textPrimary"
            content={` ${network}`}
            dInline
            fontWeight="bold"
          />
        </Text>

        {childId === "0" && (
          <ChipBadge color="success" label="Updated" icon="check-circle" />
        )}

        {childId !== "0" && (
          <Row>
            <ChipBadge color="error" label="Outdated" />
            <Link href={getChildLink(childId)}>See latest version</Link>
          </Row>
        )}

        <AbstractContentContainer>
          <StyledImage src={coverSrc} />
          <Paragraph content={abstract} />
        </AbstractContentContainer>

        <MainContentContainer>
          <StyledDetailsTable
            labelTextTransform="capitalize"
            my={10}
            labelWidth={220}
            expandButtonProps={{ loading: txLoading }}
            rows={[
              {
                label: t("status"),
                value: <ChipBadge icon="check-circle" label="Verified" />,
              },
              {
                label: t("amount"),
                value: <H3 content={amount} />,
                icon: iconMapper("amount"),
              },
              {
                label: t("price"),
                value: <H3 content={price} color="primary" />,
                icon: iconMapper("price"),
              },
            ]
              .concat(renderRest(rest))
              .concat(
                activeHistory.txHash
                  ? [
                      {
                        label: t("creatorPublicKey"),
                        value: <CryptoProof value={txInfo?.from} />,
                        expandable: true,
                        icon: iconMapper("creatorPublicKey"),
                      },
                      {
                        label: t("transactionId"),
                        value: <CryptoProof value={txInfo?.hash} />,
                        expandable: true,
                        icon: iconMapper("transactionId"),
                      },
                    ]
                  : []
              )}
          />
          <HistoryTreeContainer>
            <HistoryPicker
              historyItems={orderedHistories}
              activeHistory={activeHistory}
              onSelect={(item) => setActiveHistory(item)}
            />
            <HistoryTree
              activeNodeId={3}
              data={[
                {
                  key: 1,
                  description: "2020-12-20",
                  nodes: [
                    {
                      id: 1,
                      label: "NFT created",
                    },
                  ],
                },
                {
                  key: 2,
                  description: "2020-12-22",
                  nodes: [
                    {
                      id: 2,
                      label: "NFT re-created",
                    },
                    {
                      id: 3,
                      label: "Documents added",
                    },
                  ],
                },
              ]}
            />
          </HistoryTreeContainer>
        </MainContentContainer>
      </>
    );
  }
);

IndexContent.propTypes = {
  amount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  fileURI: PropTypes.arrayOf(PropTypes.string).isRequired,
  onMetaDataChange: PropTypes.func.isRequired,
  histories: PropTypes.arrayOf(PropTypes.shape()),
  _documents: PropTypes.arrayOf().isRequired,
};

IndexContent.defaultProps = {
  histories: [],
};
