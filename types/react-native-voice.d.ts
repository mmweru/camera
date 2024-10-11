declare module 'react-native-voice' {
    interface Voice {
        [x: string]: ((value: void) => void | PromiseLike<void>) | null | undefined;
        onSpeechStart?: (event: any) => void;
        onSpeechEnd?: (event: any) => void;
        onSpeechError?: (event: any) => void;
        onSpeechRecognized?: (event: any) => void;
        onSpeechResults?: (event: any) => void;
        onSpeechPartialResults?: (event: any) => void;
        start: (options?: { language?: string }) => Promise<void>;
        stop: () => Promise<void>;
        destroy: () => Promise<void>;
        cancel: () => Promise<void>;
    }

    const Voice: Voice;
    export default Voice;
}
