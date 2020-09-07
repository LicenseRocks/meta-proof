import React from "react";
import PropTypes from "prop-types";
import {
  ChipBadge,
  DetailsTable,
  H1,
  H3,
  OutlineButton,
  Text,
} from "@licenserocks/kit";

import date from "utils/date";

const renderRest = (rest) => {
  if (typeof rest === "object") {
    const res = Object.keys(rest)
      .map((key) => {
        if (typeof rest[key] === "string" && date.isValid(rest[key]))
          return { label: key, value: date.format(rest[key]) };
        if (typeof rest[key] === "string")
          return { label: key, value: rest[key] };
        if (rest[key]?.label)
          return { label: rest[key].label, value: rest[key].value };
        return false;
      })
      .filter((obj) => obj);
    return res;
  }
  return [];
};

export const IndexContent = ({
  amount,
  title,
  price,
  network,
  _documents,
  _histories,
  ...rest
}) => (
  <>
    <H1 content={title} />
    <Text color="textSecondary" mb={2}>
      Network:
      <Text
        color="textPrimary"
        content={" ".concat(network)}
        dInline
        fontWeight="bold"
      />
    </Text>
    <OutlineButton
      color="secondary"
      content="Visit Website of License"
      size="sm"
    />

    <DetailsTable
      my={10}
      rows={[
        {
          label: "Status",
          value: <ChipBadge icon="check-circle" label="Verified" />,
        },
        {
          label: "Amount",
          value: <H3 content={amount} />,
        },
        {
          label: "Unit Price",
          value: <H3 content={price} color="primary" />,
        },
      ].concat(renderRest(rest))}
    />
  </>
);

IndexContent.propTypes = {
  amount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  _documents: PropTypes.arrayOf().isRequired,
  _histories: PropTypes.arrayOf().isRequired,
};