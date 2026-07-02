import Foundation
import Vision

struct OCRResult: Codable {
    let imagePath: String
    let transcriptPath: String
    let created: Bool
    let characterCount: Int
    let error: String?
}

func transcriptPath(for imagePath: String) -> String {
    let url = URL(fileURLWithPath: imagePath)
    let directory = url.deletingLastPathComponent()
    let baseName = url.deletingPathExtension().lastPathComponent
    return directory.appendingPathComponent("\(baseName).ocr.txt").path
}

func recognizeText(imageURL: URL) throws -> [String] {
    var lines: [String] = []
    var recognitionError: Error?
    let request = VNRecognizeTextRequest { request, error in
        if let error {
            recognitionError = error
            return
        }

        let observations = (request.results as? [VNRecognizedTextObservation]) ?? []
        let sortedObservations = observations.sorted {
            if abs($0.boundingBox.minY - $1.boundingBox.minY) > 0.02 {
                return $0.boundingBox.minY > $1.boundingBox.minY
            }

            return $0.boundingBox.minX < $1.boundingBox.minX
        }

        lines = sortedObservations.compactMap { observation in
            observation.topCandidates(1).first?.string
        }
    }

    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = ["en-US"]

    let handler = VNImageRequestHandler(url: imageURL, options: [:])
    try handler.perform([request])

    if let recognitionError {
        throw recognitionError
    }

    return lines.filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
}

func processImage(path: String) -> OCRResult {
    let outputPath = transcriptPath(for: path)

    do {
        let imageURL = URL(fileURLWithPath: path)
        let lines = try recognizeText(imageURL: imageURL)
        let transcript = lines.joined(separator: "\n")
        try transcript.write(toFile: outputPath, atomically: true, encoding: .utf8)

        return OCRResult(
            imagePath: path,
            transcriptPath: outputPath,
            created: true,
            characterCount: transcript.count,
            error: nil
        )
    } catch {
        return OCRResult(
            imagePath: path,
            transcriptPath: outputPath,
            created: false,
            characterCount: 0,
            error: error.localizedDescription
        )
    }
}

let imagePaths = Array(CommandLine.arguments.dropFirst())
let results = imagePaths.map(processImage)
let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .sortedKeys]

if let data = try? encoder.encode(results),
   let json = String(data: data, encoding: .utf8) {
    print(json)
}
