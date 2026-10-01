import React from "react";
import { HStack, Heading } from "@gluestack-ui/themed";

export default function Header({ title, left, right }) {
  return (
    <HStack
      pb="$3"
      alignItems="center"
      justifyContent="space-between"
      minHeight={44}
    >
      <HStack alignItems="center" space="md" flex={1}>
        {left}
        {typeof title === "string" ? (
          <Heading size="2xl">{title}</Heading>
        ) : (
          title
        )}
      </HStack>
      <HStack alignItems="center" space="lg">
        {right}
      </HStack>
    </HStack>
  );
}
