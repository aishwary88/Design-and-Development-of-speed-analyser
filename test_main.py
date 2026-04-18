import unittest
from main import calculate_speed

class TestSpeedCalculation(unittest.TestCase):
    def test_speed_zero_time(self):
        self.assertEqual(calculate_speed(1, (0,0), (0,0), 0), 0)
    def test_speed_positive(self):
        speed = calculate_speed(1, (100,100), (50,50), 1)
        self.assertTrue(speed >= 0)

if __name__ == '__main__':
    unittest.main()
