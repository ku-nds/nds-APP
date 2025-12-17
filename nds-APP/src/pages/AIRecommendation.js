import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

function AIRecommendation() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '안녕하세요! 오늘 어떤 문화행사를 찾고 계신가요? 원하시는 행사에 대해 자유롭게 말씀해주세요.',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isLoading]);

  // 가짜 응답 생성 함수
  const getMockBotResponse = (userInput) => {
    // 사용자의 입력에 상관없이 보여줄 가짜 추천 데이터
    return {
      message: `"${userInput}"에 대해 찾아보았어요! 좋아하실만한 맞춤 행사들을 추천해 드릴게요.`,
      events: [
        { id: 1, title: '2025 서울 봄꽃 축제', location: '여의도 한강공원', date: '2025.04.01 - 04.10' },
        { id: 2, title: '현대 미술 특별전: 빛의 형태', location: '서울시립미술관', date: '2025.03.15 - 05.20' },
        { id: 3, title: '세종문화회관 클래식 나이트', location: '세종문화회관', date: '2025.03.28' },
      ]
    };
  };

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;

    // 1. 사용자 메시지 추가
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText; // 응답에 쓸 텍스트 보관
    setInputText('');
    setIsLoading(true);

    // 2. 1초 뒤에 AI 응답이 오는 것처럼 시뮬레이션
    setTimeout(() => {
      const response = getMockBotResponse(currentInput);

      const botMessage = {
        id: Date.now() + 1,
        text: response.message,
        isBot: true,
        timestamp: new Date(),
        events: response.events,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 추천 챗봇</Text>
        <Text style={styles.headerSubtitle}>원하는 행사에 대해 물어보세요 (Demo)</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View key={message.id} style={styles.messageWrapper}>
            <View
              style={[
                styles.messageBubble,
                message.isBot ? styles.botMessage : styles.userMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isBot ? styles.botMessageText : styles.userMessageText,
                ]}
              >
                {message.text}
              </Text>

              {/* 가짜 추천 행사 카드 */}
              {message.events && message.events.map((event) => (
                <TouchableOpacity key={event.id} style={styles.eventCard}>
                  <Text style={styles.eventTitle}>📌 {event.title}</Text>
                  <Text style={styles.eventInfo}>{event.location} | {event.date}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        {isLoading && (
          <View style={styles.messageWrapper}>
            <View style={[styles.messageBubble, styles.botMessage]}>
              <Text style={styles.botMessageText}>AI가 최적의 행사를 찾는 중입니다...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="예: 이번 주말에 갈만한 무료 전시회 알려줘"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// 스타일 시트는 기존과 동일하므로 유지 (일부 카드 가독성만 개선)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 13, color: '#888' },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16 },
  messageWrapper: { marginBottom: 15 },
  messageBubble: { maxWidth: '85%', padding: 14, borderRadius: 18 },
  botMessage: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  userMessage: { backgroundColor: '#2196F3', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  messageText: { fontSize: 15, lineHeight: 20 },
  botMessageText: { color: '#444' },
  userMessageText: { color: '#fff' },
  eventCard: { backgroundColor: '#f0f7ff', padding: 12, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#d1e3ff' },
  eventTitle: { fontSize: 14, fontWeight: 'bold', color: '#0D47A1' },
  eventInfo: { fontSize: 12, color: '#555', marginTop: 2 },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, fontSize: 15, borderHorizontal: 1, borderColor: '#ddd' },
  sendButton: { backgroundColor: '#2196F3', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 20 },
  sendButtonDisabled: { backgroundColor: '#bbb' },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default AIRecommendation;

