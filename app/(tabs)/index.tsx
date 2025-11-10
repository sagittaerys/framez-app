import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { supabase } from "../../src/config/supabase";

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
}

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

interface PostWithProfile extends Post {
  profile?: Profile;
}

export default function FeedScreen() {
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Get all posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Get all unique user IDs
      const userIds = [...new Set(postsData.map((post) => post.user_id))];

      // Get profiles for those users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        // Still show posts even if profiles fail
        setPosts(postsData);
      } else {
        // Combine posts with their profiles
        const postsWithProfiles = postsData.map((post) => ({
          ...post,
          profile: profilesData?.find((p) => p.id === post.user_id),
        }));
        setPosts(postsWithProfiles);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const renderPost = ({ item }: { item: PostWithProfile }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.profile?.username?.[0]?.toUpperCase() || "?"}
          </Text>
        </View>
        <View>
          <Text style={styles.username}>
            {item.profile?.username || "Unknown User"}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      {item.image_url && (
  <View style={styles.imagePlaceholder}>
    <Text>Image</Text>
    <Image
      source={{ uri: item.image_url }}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 8,
        resizeMode: 'cover',
        position: 'absolute',
      }}
    />
  </View>
)}

    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  empty: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
});
