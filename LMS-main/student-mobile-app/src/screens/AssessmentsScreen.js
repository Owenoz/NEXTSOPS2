import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../config/theme';

export default function AssessmentsScreen({ navigation }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const response = await apiService.getAssessments();
      if (response.success) {
        setAssessments(response.data.assessments || []);
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAssessments();
  };

  const getAssessmentIcon = (type) => {
    switch (type) {
      case 'quiz':
        return 'help-circle-outline';
      case 'assignment':
        return 'document-text-outline';
      case 'exam':
        return 'school-outline';
      case 'project':
        return 'briefcase-outline';
      default:
        return 'clipboard-outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'graded':
        return COLORS.brandBlue;
      default:
        return COLORS.textLight;
    }
  };

  const renderAssessmentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.assessmentCard}
      onPress={() =>
        navigation.navigate('AssessmentDetail', { assessmentId: item.id })
      }
    >
      <View style={styles.assessmentHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${COLORS.brandBlue}20` },
          ]}
        >
          <Ionicons
            name={getAssessmentIcon(item.assessment_type)}
            size={24}
            color={COLORS.brandBlue}
          />
        </View>
        <View style={styles.assessmentInfo}>
          <Text style={styles.assessmentTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.assessmentCourse} numberOfLines={1}>
            {item.course?.title || 'Course'}
          </Text>
        </View>
      </View>

      <View style={styles.assessmentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>
            {item.time_limit_minutes
              ? `${item.time_limit_minutes} minutes`
              : 'No time limit'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="star-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{item.max_points} points</Text>
        </View>
        {item.due_date && (
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              Due: {new Date(item.due_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.assessmentFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status?.toUpperCase() || 'NOT STARTED'}
          </Text>
        </View>
        {item.score !== undefined && (
          <Text style={styles.scoreText}>
            Score: {item.score}/{item.max_points}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brandBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assessments</Text>
        <Text style={styles.headerSubtitle}>
          {assessments.length} {assessments.length === 1 ? 'assessment' : 'assessments'}
        </Text>
      </View>

      <FlatList
        data={assessments}
        renderItem={renderAssessmentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={80} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No assessments available</Text>
            <Text style={styles.emptySubtext}>
              Assessments will appear here when assigned
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  header: {
    backgroundColor: COLORS.surfaceCard,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  listContent: {
    padding: SPACING.lg,
  },
  assessmentCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  assessmentHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  assessmentInfo: {
    flex: 1,
  },
  assessmentTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs / 2,
  },
  assessmentCourse: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  assessmentDetails: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  detailText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  assessmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: '#fff',
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  scoreText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.brandBlue,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
