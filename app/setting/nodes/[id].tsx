import { AddNodeModal } from "@/components/setting/node/AddNodeModal";
import { NodeItem, NodeItemData } from "@/components/setting/node/NodeItem";
import { FixedBottomButton } from "@/components/ui/FixedBottomButton";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const INITIAL_NODES: { [key: string]: NodeItemData[] } = {
  bnb: [
    {
      id: "1",
      name: "Defibit",
      url: "https://bsc-dataseed3.defibit.io",
      latency: 671,
      isSelected: true,
    },
    { id: "2", name: "Llamarpc", url: "https://unissat.io", latency: 0 },
    {
      id: "3",
      name: "Binance",
      url: "https://web3.mybitkeep.io",
      latency: 871,
    },
    { id: "4", name: "Defibit", url: "https://web3.uniswap.me", latency: 751 },
    { id: "5", name: "Defibit", url: "https://web3.mybit.io", latency: 881 },
  ],
};

export default function NodeManagementScreen() {
  const { id, name } = useLocalSearchParams();
  const [nodes, setNodes] = useState<NodeItemData[]>(
    INITIAL_NODES[id as string] || INITIAL_NODES.bnb
  );
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSelectNode = (selectedNode: NodeItemData) => {
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        isSelected: node.id === selectedNode.id,
      }))
    );
  };

  const handleAddNode = (nodeName: string, url: string) => {
    const newNode: NodeItemData = {
      id: Date.now().toString(),
      name: nodeName,
      url: url,
      latency: Math.floor(Math.random() * 500) + 100,
      isSelected: false,
    };
    setNodes((prev) => [...prev, newNode]);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: (name as string) || "Chain Nodes",
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {nodes.map((node) => (
          <NodeItem key={node.id} item={node} onPress={handleSelectNode} />
        ))}
      </ScrollView>

      <FixedBottomButton
        title="添加自定义节点"
        onPress={() => setModalVisible(true)}
      />

      <AddNodeModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleAddNode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
});
