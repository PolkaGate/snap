// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OnSignatureHandler, SeverityLevel } from "@metamask/snaps-sdk";
import { Box, Heading, Text } from "@metamask/snaps-sdk/jsx";

export const onSignature: OnSignatureHandler = async ({
  signature,
  signatureOrigin,
}) => {

  // const { signatureMethod, from, data } = signature;

  // const insights = /* Get insights based on custom logic */;
  return {
    content: (
      <Box>
        <Heading>My Signature Insights</Heading>
        {/* <Text>Here are the insights:</Text>
        <Text>signature:{String(signature)}</Text>
        <Text>signatureMethod:{String(signatureMethod)}</Text>
        <Text>from:{String(from)}</Text>
        <Text>data:{String(data)}</Text>
        <Text>signatureOrigin:{String(signatureOrigin)}</Text> */}
        {/* {insights.map((insight) => (
          <Text>{insight.value}</Text>
        ))} */}
      </Box>
    ),
    severity: SeverityLevel.Critical,
  };
};