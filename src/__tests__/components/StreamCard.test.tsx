import { render, screen, fireEvent } from '@testing-library/react';
import { StreamCard } from '@/components/StreamCard';
import { useStreamStore } from '@/store/streamStore';
import { Stream } from '@/types/stream';

// Mock the store
jest.mock('@/store/streamStore');

const mockStream: Stream = {
  id: '123',
  user_id: '456',
  user_login: 'testuser',
  user_name: 'Test User',
  game_id: '789',
  game_name: 'Test Game',
  game_box_art_url: 'https://example.com/game.jpg',
  type: 'live',
  title: 'Test Stream Title',
  viewer_count: 1234,
  started_at: '2024-01-01T00:00:00Z',
  language: 'en',
  thumbnail_url: 'https://example.com/thumbnail.jpg',
  tag_ids: [],
  tags: ['English'],
  is_mature: false,
};

describe('StreamCard', () => {
  const mockAddStream = jest.fn();
  const mockRemoveStream = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStreamStore as jest.Mock).mockReturnValue({
      addStream: mockAddStream,
      removeStream: mockRemoveStream,
      streams: [],
    });
  });

  it('renders stream information correctly', () => {
    render(<StreamCard stream={mockStream} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test Stream Title')).toBeInTheDocument();
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('1.2K viewers')).toBeInTheDocument();
  });

  it('displays live badge', () => {
    render(<StreamCard stream={mockStream} />);

    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('calls addStream when add button is clicked', () => {
    render(<StreamCard stream={mockStream} />);

    const addButton = screen.getByRole('button', { name: /add stream/i });
    fireEvent.click(addButton);

    expect(mockAddStream).toHaveBeenCalledWith(mockStream);
  });

  it('shows remove button when stream is active', () => {
    (useStreamStore as jest.Mock).mockReturnValue({
      addStream: mockAddStream,
      removeStream: mockRemoveStream,
      streams: [mockStream],
    });

    render(<StreamCard stream={mockStream} />);

    const removeButton = screen.getByRole('button', { name: /remove stream/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('calls removeStream when remove button is clicked', () => {
    (useStreamStore as jest.Mock).mockReturnValue({
      addStream: mockAddStream,
      removeStream: mockRemoveStream,
      streams: [mockStream],
    });

    render(<StreamCard stream={mockStream} />);

    const removeButton = screen.getByRole('button', { name: /remove stream/i });
    fireEvent.click(removeButton);

    expect(mockRemoveStream).toHaveBeenCalledWith(mockStream.id);
  });

  it('formats large viewer counts correctly', () => {
    const streamWithLargeViewers = {
      ...mockStream,
      viewer_count: 123456,
    };

    render(<StreamCard stream={streamWithLargeViewers} />);

    expect(screen.getByText('123.5K viewers')).toBeInTheDocument();
  });

  it('shows mature content warning for mature streams', () => {
    const matureStream = {
      ...mockStream,
      is_mature: true,
    };

    render(<StreamCard stream={matureStream} />);

    expect(screen.getByText('18+')).toBeInTheDocument();
  });
});