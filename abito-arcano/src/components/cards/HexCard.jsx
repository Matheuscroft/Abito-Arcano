import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";

const HexCard = ({ name, color, onClick, onEdit, onDelete }) => {
  return (
    <Flex direction="column" align="center">
      <Box
        width="150px"
        height="150px"
        p={3}
        bg={color}
        color="white"
        fontWeight="bold"
        borderRadius="8px"
        clipPath="polygon(
          20% 0%,
          80% 0%,
          100% 50%,
          80% 100%,
          20% 100%,
          0% 50%
        )"
        cursor="pointer"
        onClick={onClick}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          textAlign="center"
          wordBreak="break-word"
          flexGrow={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {name}
        </Text>
      </Box>
      <HStack mt={2}>
        <Button size="xs" colorScheme="red" onClick={onDelete}>
          Excluir
        </Button>
        <Button size="xs" colorScheme="blue" onClick={onEdit}>
          Editar
        </Button>
      </HStack>
    </Flex>
  );
};

export default HexCard;
