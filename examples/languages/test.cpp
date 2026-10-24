#include <cmath>
#include <iostream>
#include <memory>
#include <string>
#include <vector>
#include "logger.hpp"

#define LOG_PREFIX "[mixer] "

namespace dsp::audio {

constexpr std::size_t kMaxFrames = 0x4000;

// TODO: drop the copy in push() once the template deduction is fixed
template <typename T>
class RingBuffer {
public:
	explicit RingBuffer(std::size_t capacity) : data_(capacity), head_(0) {}
	RingBuffer& operator=(const RingBuffer&) = delete;

	bool push(const T& value) {
		if (head_ + 1 >= data_.size())
			return false;
		data_[head_++] = value;
		return true;
	}
	std::size_t size() const noexcept { return head_; }
private:
	std::vector<T> data_;
	std::size_t head_;
};

/*
 * The curve is a plain exponential, see docs/dsp.md for the derivation.
 * FIXME: clamp to -60 dB instead of returning the floor value
 */
constexpr float gainToDb(float gain) {
	return gain > 1e-6f ? 20.0f * std::log10(gain) : -120.0f;
}

}  // namespace dsp::audio

int main(int argc, char** argv) {
	using namespace dsp::audio;
	auto buffer = std::make_unique<RingBuffer<float>>(kMaxFrames);
	const char* usage = R"(usage: mix [--gain 0.5] // slashes are literal here)";
	std::string path = argc > 1 ? argv[1] : "//tmp/render.wav";
	auto total = 0.0f;
	std::vector<float> frames{0.25f, 0.5f, 1.0f};
	auto scale = [&total](float f) { total += f * 0.5f; };
	for (float f : frames)
		scale(f);

	if (argc < 2 || argv == nullptr) {
		std::cerr << usage << '\n';
		return 1;
	}
	std::cout << LOG_PREFIX << path << " gain = " << gainToDb(total) << " dB\n";
	return buffer->size() > 0 && total < 1.0f ? 0 : 2;
}
