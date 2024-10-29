import pandas as pd
import sys

def clean_data(input_file, output_file):
    try:
        # Load data from CSV or Excel file
        if input_file.endswith(".csv"):
            df = pd.read_csv(input_file)
        elif input_file.endswith(".xlsx"):
            df = pd.read_excel(input_file)
        else:
            print("Unsupported file type.")
            return

        # Perform cleaning (drop NaNs as an example)
        df.dropna(inplace=True)

        # Save the cleaned dataset
        df.to_csv(output_file, index=False)
        print("Cleaning completed successfully.")
    except Exception as e:
        print(f"Error during cleaning: {e}")

if __name__ == "__main__":
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    clean_data(input_path, output_path)
