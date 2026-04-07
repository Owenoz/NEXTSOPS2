import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../config/theme';

export default function CourseDetailScreen({ route, navigation }) {
  const { courseId, enrollmentId } = route.params;
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, []);

  const loadCourseData = async () => {
    try {
      const [courseRes, curriculumRes] = await Promise.all([
        apiService.getCourseDetail(courseId),
        apiService.getCourseCurriculum(courseId),
      ]);

      if (courseRes.success) {
        setCourse(courseRes.data.course);
      }
      if (curriculumRes.success) {
        setCurriculum(curriculumRes.data.units || []);
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brandBlue} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{course?.title}</Text>
        <Text style={styles.description}>{course?.description}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Course Content</Text>
        {curriculum.map((unit, index) => (
          <View key={unit.id} style={styles.unitCard}>
            <Text style={styles.unitTitle}>
              {index + 1}. {unit.title}
            </Text>
            {unit.lessons?.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonItem}
                onPress={() =>
                  navigation.navigate('Lesson', {
                    lessonId: lesson.id,
                    enrollmentId,
                  })
                }
              >
                <Ionicons
                  name={
                    lesson.status === 'completed'
                      ? 'checkmark-circle'
                      : 'play-circle-outline'
                  }
                  size={20}
                  color={
                    lesson.status === 'completed'
                      ? COLORS.success
                      : COLORS.brandBlue
                  }
                />
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
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
  },
  header: {
    backgroundColor: COLORS.surfaceCard,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  unitCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  unitTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  lessonTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
});
