from langchain.schema import Document  # type: ignore
import logging
import os
import sys
import json
import warnings
from typing import List, Dict, Any
from pathlib import Path

# Suppress all warnings
warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TRANSFORMERS_VERBOSITY'] = 'error'

logging.basicConfig(level=logging.ERROR)
for logger_name in ['chromadb', 'sentence_transformers', 'transformers', 'torch']:
    logging.getLogger(logger_name).setLevel(logging.ERROR)

# LangChain imports (updated)
try:
    from langchain_community.embeddings import HuggingFaceEmbeddings
    from langchain_community.vectorstores import Chroma
except ImportError:
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import Chroma  # type: ignore


class Config:
    """Configuration for ChromaDB setup"""
    BASE_DIR = Path(__file__).parent
    DATA_FILE = BASE_DIR / "data" / "processed" / "prob_solution.json"
    CHROMA_DB_DIR = BASE_DIR / "chroma_db"
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


class DatasetLoader:
    """Load and prepare probability/statistics dataset"""

    def __init__(self, data_path: Path):
        self.data_path = data_path

    def load_data(self) -> List[Dict[str, Any]]:
        """Load JSON dataset"""
        with open(self.data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data

    def create_documents(self, data: List[Dict[str, Any]]) -> List[Document]:
        """Convert JSON data to LangChain Documents"""
        documents = []

        for idx, item in enumerate(data):
            content = self._format_document_content(item)
            metadata = {
                "id": str(idx),
                "topic": item.get("topic", "Unknown"),
                "problem": item.get("problem", "")[:200]
            }
            documents.append(Document(page_content=content, metadata=metadata))

        return documents

    def _format_document_content(self, item: Dict[str, Any]) -> str:
        """Format problem-solution pair into structured text"""
        parts = []

        if "topic" in item:
            parts.append(f"Topic: {item['topic']}")

        if "problem" in item:
            parts.append(f"\nProblem:\n{item['problem']}")

        if "theory/description" in item:
            parts.append(f"\nTheory:\n{item['theory/description']}")

        if "solution/explanation" in item:
            parts.append(f"\nSolution:\n{item['solution/explanation']}")

        return "\n".join(parts)


class VectorStoreManager:
    """Manage ChromaDB vector store creation"""

    def __init__(self, persist_directory: Path, embedding_model: str):
        self.persist_directory = persist_directory
        self.embedding_model_name = embedding_model
        self.embeddings = None
        self.vectorstore = None

    def initialize_embeddings(self):
        """Initialize HuggingFace embeddings"""
        self.embeddings = HuggingFaceEmbeddings(
            model_name=self.embedding_model_name,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )

    def create_vectorstore(self, documents: List[Document], force_recreate: bool = False) -> Chroma:
        """Create or load ChromaDB vector store"""
        if self.persist_directory.exists() and not force_recreate:
            print("✅ Vector store already exists")
            self.vectorstore = Chroma(
                persist_directory=str(self.persist_directory),
                embedding_function=self.embeddings
            )
        else:
            print("⏳ Creating vector store...")
            self.vectorstore = Chroma.from_documents(
                documents=documents,
                embedding=self.embeddings,
                persist_directory=str(self.persist_directory)
            )
            print(f"✅ Created ({len(documents)} documents)")

        return self.vectorstore


def main(force_recreate: bool = False):
    """Main function to create ChromaDB vector store"""
    print("\n" + "="*70)
    print("🔍 CHROMADB SETUP")
    print("="*70 + "\n")

    config = Config()

    # Load dataset
    print("📚 Loading dataset...", end=" ", flush=True)
    loader = DatasetLoader(config.DATA_FILE)
    data = loader.load_data()
    documents = loader.create_documents(data)
    print(f"✅ ({len(documents)} problems)")

    # Create vector store
    print("🚀 Initializing embeddings...", end=" ", flush=True)
    vs_manager = VectorStoreManager(
        config.CHROMA_DB_DIR, config.EMBEDDING_MODEL)
    vs_manager.initialize_embeddings()
    print("✅")

    vectorstore = vs_manager.create_vectorstore(
        documents, force_recreate=force_recreate)

    # Verify
    print("🔍 Testing...", end=" ", flush=True)
    results = vectorstore.similarity_search("What is probability?", k=2)
    print(f"✅ (Retrieved {len(results)} docs)")

    print("\n" + "="*70)
    print("✅ Setup Complete!")
    print("="*70)
    print(f"📁 Location: {config.CHROMA_DB_DIR}")
    print(f"📊 Documents: {len(documents)}")
    print("="*70 + "\n")


if __name__ == "__main__":
    force = "--force" in sys.argv or "-f" in sys.argv

    if force:
        print("⚠️  Force recreate enabled\n")

    try:
        main(force_recreate=force)
    except KeyboardInterrupt:
        print("\n\n👋 Cancelled\n")
    except Exception as e:
        print(f"\n❌ Error: {e}\n")
        sys.exit(1)
