import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../config/theme';

export default function AIStudyToolsScreen() {
  const [activeTab, setActiveTab] = useState('quiz');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(null);

  // Quiz Generator State
  const [quizTopic, setQuizTopic] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  // Translator State
  const [textToTranslate, setTextToTranslate] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');

  // Text-to-Speech State
  const [textToSpeak, setTextToSpeak] = useState('');
  const [ttsLanguage, setTtsLanguage] = useState('en');
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    try {
      const response = await apiService.getAIUsage();
      if (response.success) {
        setUsage(response.data);
      }
    } catch (error) {
      console.error('Error loading AI usage:', error);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.generateQuiz(
        quizTopic,
        quizDifficulty,
        questionCount
      );

      if (response.success) {
        setGeneratedQuiz(response.data);
        Alert.alert('Success', 'Quiz generated successfully!');
        loadUsage(); // Refresh usage stats
      } else {
        Alert.alert('Error', response.error?.message || 'Failed to generate quiz');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error?.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!textToTranslate.trim()) {
      Alert.alert('Error', 'Please enter text to translate');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.translateText(textToTranslate, targetLanguage);

      if (response.success) {
        setTranslatedText(response.data.translated_text);
        loadUsage();
      } else {
        Alert.alert('Error', response.error?.message || 'Translation failed');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error?.message || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!textToSpeak.trim()) {
      Alert.alert('Error', 'Please enter text to convert to speech');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.textToSpeech(textToSpeak, ttsLanguage);

      if (response.success) {
        setAudioUrl(response.data.audio_url);
        Alert.alert('Success', 'Audio generated! (Audio playback coming soon)');
        loadUsage();
      } else {
        Alert.alert('Error', response.error?.message || 'Text-to-speech failed');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error?.message || 'Text-to-speech failed');
    } finally {
      setLoading(false);
    }
  };

  const renderQuizGenerator = () => (
    <View style={styles.toolContainer}>
      <Text style={styles.toolTitle}>AI Quiz Generator</Text>
      <Text style={styles.toolDescription}>
        Generate practice quizzes on any topic to test your knowledge
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Topic</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., World War II, Photosynthesis, Python Programming"
          value={quizTopic}
          onChangeText={setQuizTopic}
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Difficulty Level</Text>
        <View style={styles.segmentedControl}>
          {['easy', 'medium', 'hard'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.segmentButton,
                quizDifficulty === level && styles.segmentButtonActive,
              ]}
              onPress={() => setQuizDifficulty(level)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.segmentText,
                  quizDifficulty === level && styles.segmentTextActive,
                ]}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Number of Questions: {questionCount}</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setQuestionCount(Math.max(1, questionCount - 1))}
            disabled={loading}
          >
            <Ionicons name="remove" size={20} color={COLORS.brandBlue} />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{questionCount}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setQuestionCount(Math.min(20, questionCount + 1))}
            disabled={loading}
          >
            <Ionicons name="add" size={20} color={COLORS.brandBlue} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.generateButton, loading && styles.generateButtonDisabled]}
        onPress={handleGenerateQuiz}
        disabled={loading}
      >
        <LinearGradient
          colors={loading ? ['#ccc', '#999'] : COLORS.gradientBlue}
          style={styles.generateButtonGradient}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.generateButtonText}>Generate Quiz</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {generatedQuiz && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Generated Quiz</Text>
          {generatedQuiz.questions?.map((q, index) => (
            <View key={index} style={styles.questionCard}>
              <Text style={styles.questionText}>
                {index + 1}. {q.question}
              </Text>
              {q.options?.map((option, optIndex) => (
                <Text key={optIndex} style={styles.optionText}>
                  {String.fromCharCode(65 + optIndex)}. {option}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderTranslator = () => (
    <View style={styles.toolContainer}>
      <Text style={styles.toolTitle}>AI Translator</Text>
      <Text style={styles.toolDescription}>
        Translate text to different languages for better understanding
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Text to Translate</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter text to translate..."
          value={textToTranslate}
          onChangeText={setTextToTranslate}
          multiline
          numberOfLines={4}
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Target Language</Text>
        <View style={styles.languageGrid}>
          {[
            { code: 'es', name: 'Spanish' },
            { code: 'fr', name: 'French' },
            { code: 'de', name: 'German' },
            { code: 'zh', name: 'Chinese' },
            { code: 'ar', name: 'Arabic' },
            { code: 'hi', name: 'Hindi' },
          ].map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                targetLanguage === lang.code && styles.languageButtonActive,
              ]}
              onPress={() => setTargetLanguage(lang.code)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.languageText,
                  targetLanguage === lang.code && styles.languageTextActive,
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.generateButton, loading && styles.generateButtonDisabled]}
        onPress={handleTranslate}
        disabled={loading}
      >
        <LinearGradient
          colors={loading ? ['#ccc', '#999'] : COLORS.gradientOrange}
          style={styles.generateButtonGradient}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="language" size={20} color="#fff" />
              <Text style={styles.generateButtonText}>Translate</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {translatedText && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Translation</Text>
          <Text style={styles.translatedText}>{translatedText}</Text>
        </View>
      )}
    </View>
  );

  const renderTextToSpeech = () => (
    <View style={styles.toolContainer}>
      <Text style={styles.toolTitle}>Text-to-Speech</Text>
      <Text style={styles.toolDescription}>
        Convert text to audio for easier learning and accessibility
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Text to Convert</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter text to convert to speech..."
          value={textToSpeak}
          onChangeText={setTextToSpeak}
          multiline
          numberOfLines={4}
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Language</Text>
        <View style={styles.segmentedControl}>
          {[
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Spanish' },
            { code: 'fr', name: 'French' },
          ].map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.segmentButton,
                ttsLanguage === lang.code && styles.segmentButtonActive,
              ]}
              onPress={() => setTtsLanguage(lang.code)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.segmentText,
                  ttsLanguage === lang.code && styles.segmentTextActive,
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.generateButton, loading && styles.generateButtonDisabled]}
        onPress={handleTextToSpeech}
        disabled={loading}
      >
        <LinearGradient
          colors={loading ? ['#ccc', '#999'] : COLORS.gradientSage}
          style={styles.generateButtonGradient}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="volume-high" size={20} color="#fff" />
              <Text style={styles.generateButtonText}>Generate Audio</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {audioUrl && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Audio Generated</Text>
          <Text style={styles.infoText}>
            Audio playback feature coming soon. Audio URL: {audioUrl}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientBlue} style={styles.header}>
        <Text style={styles.headerTitle}>AI Study Tools</Text>
        <Text style={styles.headerSubtitle}>
          Powered by artificial intelligence to enhance your learning
        </Text>
        {usage && (
          <View style={styles.usageCard}>
            <Text style={styles.usageText}>
              AI Credits Used: {usage.total_usage || 0} / {usage.quota || 'Unlimited'}
            </Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quiz' && styles.tabActive]}
          onPress={() => setActiveTab('quiz')}
        >
          <Ionicons
            name="help-circle"
            size={20}
            color={activeTab === 'quiz' ? COLORS.brandBlue : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'quiz' && styles.tabTextActive,
            ]}
          >
            Quiz
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'translate' && styles.tabActive]}
          onPress={() => setActiveTab('translate')}
        >
          <Ionicons
            name="language"
            size={20}
            color={activeTab === 'translate' ? COLORS.brandBlue : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'translate' && styles.tabTextActive,
            ]}
          >
            Translate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'tts' && styles.tabActive]}
          onPress={() => setActiveTab('tts')}
        >
          <Ionicons
            name="volume-high"
            size={20}
            color={activeTab === 'tts' ? COLORS.brandBlue : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'tts' && styles.tabTextActive,
            ]}
          >
            Audio
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'quiz' && renderQuizGenerator()}
        {activeTab === 'translate' && renderTranslator()}
        {activeTab === 'tts' && renderTextToSpeech()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: SPACING.xs,
  },
  usageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  usageText: {
    color: '#fff',
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.brandBlue,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  tabTextActive: {
    color: COLORS.brandBlue,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  toolContainer: {
    padding: SPACING.lg,
  },
  toolTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  toolDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    fontSize: TYPOGRAPHY.fontSize.md,
    backgroundColor: COLORS.surfaceCard,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs / 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.brandBlue,
  },
  segmentText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  counterValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.xl,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs / 2,
  },
  languageButton: {
    width: '31%',
    margin: SPACING.xs / 2,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: COLORS.brandOrange,
    borderColor: COLORS.brandOrange,
  },
  languageText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
  },
  languageTextActive: {
    color: '#fff',
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  generateButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginLeft: SPACING.xs,
  },
  resultContainer: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  resultTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  questionCard: {
    marginBottom: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  questionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  optionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    marginBottom: SPACING.xs / 2,
  },
  translatedText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  infoText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
