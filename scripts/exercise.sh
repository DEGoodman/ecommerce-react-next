#!/bin/bash
# Exercise management script

set -e

EXERCISES_DIR="exercises"
MANIFEST="$EXERCISES_DIR/manifest.json"
PROGRESS_FILE=".learning-progress"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
    echo "Exercise Management"
    echo ""
    echo "Usage:"
    echo "  ./scripts/exercise.sh start <exercise> [--guided|--challenge]"
    echo "  ./scripts/exercise.sh complete <exercise>"
    echo "  ./scripts/exercise.sh reset <exercise> [--guided|--challenge]"
    echo "  ./scripts/exercise.sh clean <exercise>"
    echo "  ./scripts/exercise.sh list"
    echo "  ./scripts/exercise.sh status"
    echo ""
    echo "Commands:"
    echo "  start     - Copy exercise starter code to target location"
    echo "  complete  - Mark exercise as done, suggest next one"
    echo "  reset     - Overwrite with starter code (lose your work!)"
    echo "  clean     - Remove NEW files created by exercise"
    echo "             (Note: won't revert modifications to existing files)"
    echo ""
    echo "Examples:"
    echo "  make exercise-start E=1-5 T=guided"
    echo "  make exercise-complete E=1-5"
    echo "  make exercise-reset E=1-5 T=guided"
    echo "  make exercise-clean E=1-5"
    echo ""
    echo "Note: Exercises build on each other. Complete them in order."
}

extract_code_from_markdown() {
    local md_file="$1"
    # Extract content between ```tsx or ```ts and ```, remove the fence lines
    sed -n '/^```tsx*$/,/^```$/p' "$md_file" | sed '1d;$d'
}

get_target_path() {
    local filename="$1"
    local base_dir="$2"

    case "$filename" in
        types.ts|types.completed.ts) echo "$base_dir/src/types/index.ts" ;;
        ProductList.tsx|ProductList.completed.tsx) echo "$base_dir/src/components/ProductList.tsx" ;;
        ProductDisplay.tsx|ProductDisplay.completed.tsx) echo "$base_dir/src/components/ProductDisplay.tsx" ;;
        ProductCard.tsx|ProductCard.completed.tsx) echo "$base_dir/src/components/ProductCard.tsx" ;;
        useFetch.ts|useFetch.completed.ts) echo "$base_dir/src/hooks/useFetch.ts" ;;
        RecentlyViewedContext.tsx|RecentlyViewedContext.completed.tsx) echo "$base_dir/src/context/RecentlyViewedContext.tsx" ;;
        useProducts.ts|useProducts.completed.ts) echo "$base_dir/src/hooks/useProducts.ts" ;;
        useDebounce.ts|useDebounce.completed.ts) echo "$base_dir/src/hooks/useDebounce.ts" ;;
        useLocalStorage.ts|useLocalStorage.completed.ts) echo "$base_dir/src/hooks/useLocalStorage.ts" ;;
        CheckoutForm.tsx|CheckoutForm.completed.tsx) echo "$base_dir/src/components/CheckoutForm.tsx" ;;
        ProductDetail.tsx|ProductDetail.completed.tsx) echo "$base_dir/src/components/ProductDetail.tsx" ;;
        *) echo "" ;;
    esac
}

apply_exercise_files() {
    local exercise_dir="$1"
    local track_name="$2"
    local base_dir="$3"
    local file_pattern="$4"  # "completed" or "starter" (no .completed in name)
    local silent="$5"

    local track_dir="$exercise_dir/$track_name"

    if [ ! -d "$track_dir" ]; then
        return
    fi

    for md_file in "$track_dir"/*.md; do
        if [ -f "$md_file" ]; then
            local filename=$(basename "$md_file" .md)

            # Check if this file matches the pattern we want
            if [ "$file_pattern" = "completed" ]; then
                # Only process .completed.tsx.md files
                [[ "$filename" != *.completed.* ]] && continue
            else
                # Only process non-completed files (starters)
                [[ "$filename" == *.completed.* ]] && continue
            fi

            local target_path=$(get_target_path "$filename" "$base_dir")

            if [ -n "$target_path" ]; then
                mkdir -p "$(dirname "$target_path")"
                extract_code_from_markdown "$md_file" > "$target_path"
                [ -z "$silent" ] && echo -e "${GREEN}✓${NC} Created $target_path"
            fi
        fi
    done
}

start_exercise() {
    local exercise="$1"
    local track="${2:---guided}"

    # Parse module and exercise number
    local module="${exercise%%-*}"
    local ex_num="${exercise#*-}"

    # Determine track name
    local track_name="${track#--}"

    local base_dir="apps/crawl/frontend"

    echo -e "${BLUE}Starting exercise $exercise ($track_name track)${NC}"
    echo ""

    # First, apply completed files from all previous exercises
    if [ "$ex_num" -gt 1 ]; then
        echo -e "${YELLOW}Applying prerequisites (1-1 through 1-$((ex_num-1)))...${NC}"
        for prev_num in $(seq 1 $((ex_num - 1))); do
            local prev_exercise="$module-$prev_num"
            local prev_dir=$(find "$EXERCISES_DIR/module-$module" -type d -name "${prev_exercise}-*" 2>/dev/null | head -1)

            if [ -n "$prev_dir" ]; then
                apply_exercise_files "$prev_dir" "$track_name" "$base_dir" "completed" "silent"
            fi
        done
        echo -e "${GREEN}✓${NC} Prerequisites applied"
        echo ""
    fi

    # Find current exercise directory
    local exercise_dir=$(find "$EXERCISES_DIR/module-$module" -type d -name "${exercise}-*" 2>/dev/null | head -1)

    if [ -z "$exercise_dir" ]; then
        echo -e "${RED}Exercise $exercise not found${NC}"
        exit 1
    fi

    local track_dir="$exercise_dir/$track_name"

    if [ ! -d "$track_dir" ]; then
        echo -e "${RED}Track '$track_name' not found for exercise $exercise${NC}"
        exit 1
    fi

    # Apply starter files for current exercise
    echo -e "${YELLOW}Setting up exercise $exercise...${NC}"
    apply_exercise_files "$exercise_dir" "$track_name" "$base_dir" "starter"

    # Show the instructions from the first starter file
    for md_file in "$track_dir"/*.md; do
        if [ -f "$md_file" ]; then
            local filename=$(basename "$md_file" .md)
            [[ "$filename" == *.completed.* ]] && continue

            echo ""
            echo -e "${YELLOW}=== Instructions ===${NC}"
            sed '/^```/,$d' "$md_file"
            break  # Only show instructions from first file
        fi
    done

    # Update progress file
    echo "track: $track_name" > "$PROGRESS_FILE"
    echo "current_exercise: $exercise" >> "$PROGRESS_FILE"
    echo "module: $module" >> "$PROGRESS_FILE"

    echo ""
    echo -e "${GREEN}Exercise $exercise is ready!${NC}"
    echo -e "Run ${BLUE}make crawl${NC} to start the dev server."
}

list_exercises() {
    echo -e "${BLUE}Available Exercises${NC}"
    echo ""
    echo "Module 1: React + TypeScript Foundations"
    echo "  1-1  TypeScript Basics (Hours 1-2)"
    echo "  1-2  Components & Props (Hours 3-4)"
    echo "  1-3  State with useState (Hours 5-6)"
    echo "  1-4  useEffect & Data Fetching (Hours 7-8)"
    echo "  1-5  Context API (Hours 9-10)"
    echo "  1-6  Custom Hooks (Hours 11-12)"
    echo "  1-7  Patterns & Review (Hours 13-14)"
    echo ""
    echo "Use: make exercise-start E=1-5 T=guided"
}

show_status() {
    if [ -f "$PROGRESS_FILE" ]; then
        echo -e "${BLUE}Current Progress${NC}"
        cat "$PROGRESS_FILE"
    else
        echo "No exercise in progress. Start one with: make exercise-start E=1-1"
    fi
}

reset_exercise() {
    local exercise="$1"
    local track="${2:---guided}"

    echo -e "${YELLOW}Resetting exercise $exercise...${NC}"
    # Just run start again - it overwrites the files
    start_exercise "$exercise" "$track"
    echo -e "${GREEN}Exercise reset to starter code${NC}"
}

complete_exercise() {
    local exercise="$1"

    if [ ! -f "$PROGRESS_FILE" ]; then
        echo -e "${RED}No exercise in progress${NC}"
        exit 1
    fi

    # Update progress file to mark complete
    local current=$(grep "current_exercise:" "$PROGRESS_FILE" | cut -d' ' -f2)
    if [ "$current" != "$exercise" ]; then
        echo -e "${YELLOW}Warning: Current exercise is $current, not $exercise${NC}"
    fi

    echo "last_completed: $exercise" >> "$PROGRESS_FILE"
    echo -e "${GREEN}Marked exercise $exercise as complete!${NC}"

    # Suggest next exercise
    local module="${exercise%%-*}"
    local num="${exercise#*-}"
    local next_num=$((num + 1))
    echo -e "Next exercise: ${BLUE}make exercise-start E=${module}-${next_num}${NC}"
}

clean_exercise() {
    local exercise="$1"

    # Parse module and exercise number
    local module="${exercise%%-*}"

    # Find the exercise directory
    local exercise_dir=$(find "$EXERCISES_DIR/module-$module" -type d -name "${exercise}-*" 2>/dev/null | head -1)

    if [ -z "$exercise_dir" ]; then
        echo -e "${RED}Exercise $exercise not found${NC}"
        exit 1
    fi

    local base_dir="apps/crawl/frontend"

    echo -e "${YELLOW}Cleaning exercise $exercise files...${NC}"

    # Remove files that were created for this exercise
    for track_dir in "$exercise_dir"/guided "$exercise_dir"/challenge; do
        if [ -d "$track_dir" ]; then
            for md_file in "$track_dir"/*.md; do
                if [ -f "$md_file" ]; then
                    local filename=$(basename "$md_file" .md)
                    local target_path=""

                    case "$filename" in
                        types.ts) target_path="$base_dir/src/types/index.ts" ;;
                        ProductDisplay.tsx) target_path="$base_dir/src/components/ProductDisplay.tsx" ;;
                        ProductCard.tsx) target_path="$base_dir/src/components/ProductCard.tsx" ;;
                        useFetch.ts) target_path="$base_dir/src/hooks/useFetch.ts" ;;
                        RecentlyViewedContext.tsx) target_path="$base_dir/src/context/RecentlyViewedContext.tsx" ;;
                        useProducts.ts) target_path="$base_dir/src/hooks/useProducts.ts" ;;
                        useDebounce.ts) target_path="$base_dir/src/hooks/useDebounce.ts" ;;
                        useLocalStorage.ts) target_path="$base_dir/src/hooks/useLocalStorage.ts" ;;
                        CheckoutForm.tsx) target_path="$base_dir/src/components/CheckoutForm.tsx" ;;
                        ProductDetail.tsx) target_path="$base_dir/src/components/ProductDetail.tsx" ;;
                    esac

                    if [ -n "$target_path" ] && [ -f "$target_path" ]; then
                        rm "$target_path"
                        echo -e "${GREEN}✓${NC} Removed $target_path"
                    fi
                fi
            done
        fi
    done

    echo -e "${GREEN}Exercise $exercise cleaned${NC}"
}

# Main command router
case "${1:-help}" in
    start)
        start_exercise "$2" "$3"
        ;;
    complete)
        complete_exercise "$2"
        ;;
    reset)
        reset_exercise "$2" "$3"
        ;;
    clean)
        clean_exercise "$2"
        ;;
    list)
        list_exercises
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
