import React, { useState, useEffect } from "react";
import { setarCorAreaETexto } from "./utils";
import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import { Checkbox } from "./ui/checkbox";
import type { AreaResponseDTO } from "@/types/area";
import type { ActivityItem } from "@/types/item";

interface AtividadeProps {
  atividade: ActivityItem;
  areas: AreaResponseDTO[];
  onEdit?: (atividade: ActivityItem) => void;
  onDelete?: (atividade: ActivityItem) => void;
  onToggle?: (atividade: ActivityItem) => void;
}

const Atividade: React.FC<AtividadeProps> = ({
  atividade,
  onEdit,
  onDelete,
  onToggle,
  areas,
}) => {
  const [corArea, setCorArea] = useState("#000");
  const [corTexto, setCorTexto] = useState("#fff");

  useEffect(() => {
    if (Array.isArray(areas) && atividade.areaId) {
      setarCorAreaETexto(atividade, areas, setCorArea, setCorTexto);
    }
  }, [atividade.areaId, areas, atividade]);

  return (
    <Flex align="center" justify="space-between" width="100%">
      <Flex align="center" gap={3} flex="1">
        <Checkbox
          checked={false}
          onCheckedChange={() => onToggle?.(atividade)}
        />

        <Text
          as="button"
          fontWeight="bold"
          fontSize="md"
          color="blue.200"
          _hover={{ textDecoration: "underline", cursor: "pointer" }}
        >
          {atividade.title}
        </Text>

        <Badge
          bg={corArea}
          color={corTexto}
          px={2}
          py={1}
          borderRadius="md"
          fontSize="sm"
        >
          +{atividade.score}
        </Badge>

        {atividade.subareaId && (
          <Box>
            <Text fontSize="sm" color="gray.500" mr={5}>
              {atividade.subareaId}
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default Atividade;
